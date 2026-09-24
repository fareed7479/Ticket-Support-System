const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/users - Agent only endpoint to fetch support agents list
router.get('/', requireRole('agent'), userController.getAgents);

module.exports = router;
