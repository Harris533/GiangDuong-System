const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all borrow requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, user_id } = req.query;
    
    let query = `
      SELECT br.*, e.name as equipment_name, u.name as user_name, u.email as user_email,
             a.name as approved_by_name
      FROM borrow_requests br
      JOIN equipment e ON br.equipment_id = e.id
      JOIN users u ON br.user_id = u.id
      LEFT JOIN users a ON br.approved_by = a.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Regular users can only see their own requests
    if (req.user.role === 'user') {
      paramCount++;
      query += ` AND br.user_id = $${paramCount}`;
      params.push(req.user.id);
    } else if (user_id) {
      paramCount++;
      query += ` AND br.user_id = $${paramCount}`;
      params.push(user_id);
    }

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND br.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY br.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get borrow requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create borrow request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { equipmentId, borrowDate, returnDate, purpose } = req.body;

    if (!equipmentId || !borrowDate || !returnDate) {
      return res.status(400).json({ error: 'Equipment ID, borrow date, and return date are required' });
    }

    // Check if equipment is available
    const equipmentResult = await pool.query(
      'SELECT name, status FROM equipment WHERE id = $1',
      [equipmentId]
    );

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const equipment = equipmentResult.rows[0];

    if (equipment.status !== 'available') {
      return res.status(400).json({ error: 'Equipment is not available for borrowing' });
    }

    // Check for conflicting requests
    const conflictResult = await pool.query(
      `SELECT COUNT(*) FROM borrow_requests 
       WHERE equipment_id = $1 AND status IN ('pending', 'approved') 
       AND (
         (borrow_date <= $2 AND return_date >= $2) OR
         (borrow_date <= $3 AND return_date >= $3) OR
         (borrow_date >= $2 AND return_date <= $3)
       )`,
      [equipmentId, borrowDate, returnDate]
    );

    if (parseInt(conflictResult.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Equipment is already requested for this time period' });
    }

    const result = await pool.query(
      `INSERT INTO borrow_requests (equipment_id, user_id, borrow_date, return_date, purpose) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [equipmentId, req.user.id, borrowDate, returnDate, purpose]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'borrow_requested', `Requested to borrow: ${equipment.name}`, 'borrow_request', result.rows[0].id]
    );

    res.status(201).json({ request: result.rows[0] });
  } catch (error) {
    console.error('Create borrow request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject borrow request (admin and teacher only)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get request details
    const requestResult = await pool.query(
      `SELECT br.*, e.name as equipment_name, u.name as user_name
       FROM borrow_requests br
       JOIN equipment e ON br.equipment_id = e.id
       JOIN users u ON br.user_id = u.id
       WHERE br.id = $1 AND br.status = 'pending'`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    const request = requestResult.rows[0];

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update request status
      await client.query(
        `UPDATE borrow_requests 
         SET status = $1, notes = $2, approved_by = $3, approved_at = CURRENT_TIMESTAMP 
         WHERE id = $4`,
        [status, notes, req.user.id, id]
      );

      if (status === 'approved') {
        // Update equipment status and borrower
        await client.query(
          `UPDATE equipment 
           SET status = 'borrowed', borrowed_by = $1, borrowed_at = CURRENT_TIMESTAMP, return_date = $2 
           WHERE id = $3`,
          [request.user_id, request.return_date, request.equipment_id]
        );
      }

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, `borrow_${status}`, `${status.charAt(0).toUpperCase() + status.slice(1)} borrow request for: ${request.equipment_name}`, 'borrow_request', id]
      );

      await client.query('COMMIT');
      
      res.json({ success: true, message: `Request ${status} successfully` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update borrow request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Return equipment
router.patch('/:id/return', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Get request details
    const requestResult = await pool.query(
      `SELECT br.*, e.name as equipment_name
       FROM borrow_requests br
       JOIN equipment e ON br.equipment_id = e.id
       WHERE br.id = $1 AND br.status = 'approved'`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Approved request not found' });
    }

    const request = requestResult.rows[0];

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update request status
      await client.query(
        `UPDATE borrow_requests 
         SET status = 'returned', actual_return_date = CURRENT_TIMESTAMP, notes = $1 
         WHERE id = $2`,
        [notes, id]
      );

      // Update equipment status
      await client.query(
        `UPDATE equipment 
         SET status = 'available', borrowed_by = NULL, borrowed_at = NULL, return_date = NULL 
         WHERE id = $1`,
        [request.equipment_id]
      );

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, 'equipment_returned', `Equipment returned: ${request.equipment_name}`, 'borrow_request', id]
      );

      await client.query('COMMIT');
      
      res.json({ success: true, message: 'Equipment returned successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Return equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;