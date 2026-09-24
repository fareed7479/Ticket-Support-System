const pool = require('../db');

/**
 * Get list of agent users for ticket assignment.
 * Agent only route.
 * GET /api/users
 */
async function getAgents(req, res) {
  try {
    const [agents] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE role = ? ORDER BY name ASC',
      ['agent']
    );

    return res.status(200).json(agents);
  } catch (error) {
    console.error('[userController.getAgents] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch support agents' });
  }
}

module.exports = {
  getAgents
};
