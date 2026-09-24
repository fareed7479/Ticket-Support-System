const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { validateTicket } = require('../middleware/validateMiddleware');

// All ticket routes require authentication
router.use(authenticateToken);

// Ticket routes
router.get('/', ticketController.getTickets);
router.post('/', requireRole('customer'), validateTicket, ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', requireRole('agent'), ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
