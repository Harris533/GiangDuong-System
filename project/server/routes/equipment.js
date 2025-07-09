const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all equipment
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    
    let query = `
      SELECT e.*, u.name as borrowed_by_name 
      FROM equipment e 
      LEFT JOIN users u ON e.borrowed_by = u.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND e.status = $${paramCount}`;
      params.push(status);
    }

    if (type && type !== 'all') {
      paramCount++;
      query += ` AND e.type = $${paramCount}`;
      params.push(type);
    }

    if (search) {
      paramCount++;
      query += ` AND (e.name ILIKE $${paramCount} OR e.type ILIKE $${paramCount} OR e.location ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ equipment: result.rows });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get equipment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT e.*, u.name as borrowed_by_name 
       FROM equipment e 
       LEFT JOIN users u ON e.borrowed_by = u.id 
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ equipment: result.rows[0] });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new equipment (admin and teacher only)
router.post('/', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { name, type, location, description, serialNumber } = req.body;

    if (!name || !type || !location || !serialNumber) {
      return res.status(400).json({ error: 'Name, type, location, and serial number are required' });
    }

    const result = await pool.query(
      `INSERT INTO equipment (name, type, location, description, serial_number, purchase_date) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) 
       RETURNING *`,
      [name, type, location, description, serialNumber]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'equipment_added', `Added new equipment: ${name}`, 'equipment', result.rows[0].id]
    );

    res.status(201).json({ equipment: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    console.error('Add equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update equipment
router.put('/:id', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, location, description, status } = req.body;

    const result = await pool.query(
      `UPDATE equipment 
       SET name = $1, type = $2, location = $3, description = $4, status = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [name, type, location, description, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'equipment_updated', `Updated equipment: ${name}`, 'equipment', id]
    );

    res.json({ equipment: result.rows[0] });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete equipment
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if equipment is currently borrowed
    const equipmentResult = await pool.query(
      'SELECT name, status FROM equipment WHERE id = $1',
      [id]
    );

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const equipment = equipmentResult.rows[0];

    if (equipment.status === 'borrowed') {
      return res.status(400).json({ error: 'Cannot delete equipment that is currently borrowed' });
    }

    await pool.query('DELETE FROM equipment WHERE id = $1', [id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'equipment_deleted', `Deleted equipment: ${equipment.name}`, 'equipment', id]
    );

    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get equipment statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'borrowed') as borrowed,
        COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance,
        COUNT(*) FILTER (WHERE status = 'broken') as broken
      FROM equipment
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get equipment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;