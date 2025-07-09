const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let query = `
      SELECT id, name, email, role, phone, department, status, last_login, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (role && role !== 'all') {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new user (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { fullName, email, role, phone, department, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, department) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role, phone, department, status, created_at`,
      [fullName, email, hashedPassword, role || 'user', phone, department]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'user_added', `Added new user: ${fullName}`, 'user', result.rows[0].id]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status
router.patch('/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'user_status_changed', `Changed user status to ${status}: ${result.rows[0].name}`, 'user', id]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user has active borrows
    const borrowCheck = await pool.query(
      'SELECT COUNT(*) FROM borrow_requests WHERE user_id = $1 AND status IN ($2, $3)',
      [id, 'pending', 'approved']
    );

    if (parseInt(borrowCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete user with active borrow requests' });
    }

    const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'user_deleted', `Deleted user: ${userResult.rows[0].name}`, 'user', id]
    );

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;