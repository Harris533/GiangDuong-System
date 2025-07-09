const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get equipment stats
    const equipmentStats = await pool.query(`
      SELECT 
        COUNT(*) as total_equipment,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'borrowed') as borrowed,
        COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance
      FROM equipment
    `);

    // Get user stats
    const userStats = await pool.query(`
      SELECT COUNT(*) FILTER (WHERE status = 'active') as active_users
      FROM users
    `);

    // Get weekly borrow/return data
    const weeklyData = await pool.query(`
      SELECT 
        EXTRACT(DOW FROM created_at) as day_of_week,
        COUNT(*) FILTER (WHERE status IN ('approved', 'returned')) as borrowed,
        COUNT(*) FILTER (WHERE status = 'returned') as returned
      FROM borrow_requests 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY EXTRACT(DOW FROM created_at)
      ORDER BY day_of_week
    `);

    // Get equipment type distribution
    const typeDistribution = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count
      FROM equipment
      GROUP BY type
      ORDER BY count DESC
    `);

    // Get recent activities
    const recentActivities = await pool.query(`
      SELECT 
        al.type,
        al.description,
        al.created_at,
        u.name as user_name
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    // Format weekly data
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedWeeklyData = dayNames.map((day, index) => {
      const dayData = weeklyData.rows.find(row => parseInt(row.day_of_week) === index);
      return {
        day,
        borrowed: dayData ? parseInt(dayData.borrowed) : 0,
        returned: dayData ? parseInt(dayData.returned) : 0
      };
    });

    // Format type distribution
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const formattedTypeDistribution = typeDistribution.rows.map((item, index) => ({
      label: item.type,
      value: parseInt(item.count),
      color: colors[index % colors.length]
    }));

    res.json({
      stats: {
        totalEquipment: parseInt(equipmentStats.rows[0].total_equipment),
        currentlyBorrowed: parseInt(equipmentStats.rows[0].borrowed),
        needsMaintenance: parseInt(equipmentStats.rows[0].maintenance),
        activeUsers: parseInt(userStats.rows[0].active_users)
      },
      weeklyData: formattedWeeklyData,
      typeDistribution: formattedTypeDistribution,
      recentActivities: recentActivities.rows
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;