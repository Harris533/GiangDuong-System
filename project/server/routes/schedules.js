const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all schedules
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, status } = req.query;
    
    let query = `
      SELECT s.*, u.name as created_by_name
      FROM schedules s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (date) {
      paramCount++;
      query += ` AND s.date = $${paramCount}`;
      params.push(date);
    }

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY s.date DESC, s.start_time ASC';

    const result = await pool.query(query, params);
    res.json({ schedules: result.rows });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create schedule (admin and teacher only)
router.post('/', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { subject, class: className, instructor, room, floor, date, startTime, endTime } = req.body;

    if (!subject || !className || !instructor || !room || !floor || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for room conflicts
    const conflictResult = await pool.query(
      `SELECT COUNT(*) FROM schedules 
       WHERE room = $1 AND date = $2 AND status != 'cancelled'
       AND (
         (start_time <= $3 AND end_time > $3) OR
         (start_time < $4 AND end_time >= $4) OR
         (start_time >= $3 AND end_time <= $4)
       )`,
      [room, date, startTime, endTime]
    );

    if (parseInt(conflictResult.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Room is already booked for this time period' });
    }

    const result = await pool.query(
      `INSERT INTO schedules (subject, class, instructor, room, floor, date, start_time, end_time, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [subject, className, instructor, room, floor, date, startTime, endTime, req.user.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'schedule_created', `Created schedule: ${subject} - ${className}`, 'schedule', result.rows[0].id]
    );

    res.status(201).json({ schedule: result.rows[0] });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update schedule status
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE schedules SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'schedule_updated', `Schedule ${status}: ${result.rows[0].subject}`, 'schedule', id]
    );

    res.json({ schedule: result.rows[0] });
  } catch (error) {
    console.error('Update schedule status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete schedule
router.delete('/:id', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;

    const scheduleResult = await pool.query('SELECT subject, class FROM schedules WHERE id = $1', [id]);
    
    if (scheduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const schedule = scheduleResult.rows[0];

    await pool.query('DELETE FROM schedules WHERE id = $1', [id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, type, description, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'schedule_deleted', `Deleted schedule: ${schedule.subject} - ${schedule.class}`, 'schedule', id]
    );

    res.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;