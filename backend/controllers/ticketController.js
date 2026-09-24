const pool = require('../db');

/**
 * Get tickets list.
 * Customer gets only their tickets.
 * Agent gets all tickets.
 * Supports filtering by status, priority, text search, and sorting.
 * GET /api/tickets
 */
async function getTickets(req, res) {
  try {
    const { id: userId, role } = req.user;
    const { status, priority, search, sortBy, sortOrder } = req.query;

    let query = `
      SELECT 
        t.id,
        t.user_id,
        t.subject,
        t.description,
        t.priority,
        t.status,
        t.assigned_to,
        t.created_at,
        t.updated_at,
        u.name AS customer_name,
        u.email AS customer_email,
        agent.name AS assigned_agent_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users agent ON t.assigned_to = agent.id
    `;

    const whereConditions = [];
    const queryParams = [];

    // Role-based boundary: Customers only see their own tickets
    if (role === 'customer') {
      whereConditions.push('t.user_id = ?');
      queryParams.push(userId);
    }

    // Filter by status if provided
    if (status && ['open', 'in_progress', 'closed'].includes(status)) {
      whereConditions.push('t.status = ?');
      queryParams.push(status);
    }

    // Filter by priority if provided
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      whereConditions.push('t.priority = ?');
      queryParams.push(priority);
    }

    // Search by subject or description
    if (search && search.trim() !== '') {
      whereConditions.push('(t.subject LIKE ? OR t.description LIKE ?)');
      const searchPattern = `%${search.trim()}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Sorting logic
    let orderClause = 'ORDER BY t.created_at DESC';
    if (sortBy === 'priority') {
      // Custom ordering for ENUM priorities: high -> medium -> low or vice versa
      const direction = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      orderClause = `ORDER BY FIELD(t.priority, 'high', 'medium', 'low') ${direction}, t.created_at DESC`;
    } else if (sortBy === 'date' || sortBy === 'created_at') {
      const direction = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      orderClause = `ORDER BY t.created_at ${direction}`;
    }

    query += ` ${orderClause}`;

    const [tickets] = await pool.execute(query, queryParams);

    return res.status(200).json(tickets);
  } catch (error) {
    console.error('[ticketController.getTickets] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

/**
 * Create a new ticket (Customer only).
 * POST /api/tickets
 */
async function createTicket(req, res) {
  try {
    const { subject, description, priority = 'medium' } = req.body;
    const userId = req.user.id; // Determine ticket owner from verified JWT

    const validPriority = ['low', 'medium', 'high'].includes(priority.toLowerCase())
      ? priority.toLowerCase()
      : 'medium';

    const [result] = await pool.execute(
      'INSERT INTO tickets (user_id, subject, description, priority, status) VALUES (?, ?, ?, ?, ?)',
      [userId, subject.trim(), description.trim(), validPriority, 'open']
    );

    const [newTickets] = await pool.execute(
      `SELECT t.*, u.name AS customer_name, u.email AS customer_email 
       FROM tickets t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTickets[0]
    });
  } catch (error) {
    console.error('[ticketController.createTicket] Error:', error);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}

/**
 * Get ticket by ID with full author and assigned agent details.
 * GET /api/tickets/:id
 */
async function getTicketById(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const [tickets] = await pool.execute(
      `SELECT 
        t.id,
        t.user_id,
        t.subject,
        t.description,
        t.priority,
        t.status,
        t.assigned_to,
        t.created_at,
        t.updated_at,
        u.name AS customer_name,
        u.email AS customer_email,
        agent.name AS assigned_agent_name,
        agent.email AS assigned_agent_email
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users agent ON t.assigned_to = agent.id
      WHERE t.id = ?`,
      [ticketId]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = tickets[0];

    // Ownership check: Customer cannot view another customer's ticket
    if (req.user.role === 'customer' && ticket.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Access denied to this ticket' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error('[ticketController.getTicketById] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket details' });
  }
}

/**
 * Update ticket status, priority, or assigned agent (Agent only).
 * PUT /api/tickets/:id
 */
async function updateTicket(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const { status, priority, assigned_to } = req.body;

    // Check existence
    const [existingTickets] = await pool.execute(
      'SELECT id FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (existingTickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updates = [];
    const queryParams = [];

    if (status) {
      if (!['open', 'in_progress', 'closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updates.push('status = ?');
      queryParams.push(status);
    }

    if (priority) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      updates.push('priority = ?');
      queryParams.push(priority);
    }

    if (assigned_to !== undefined) {
      if (assigned_to === null || assigned_to === '' || assigned_to === 0) {
        updates.push('assigned_to = NULL');
      } else {
        const agentId = parseInt(assigned_to, 10);
        // Verify target agent exists and has agent role
        const [agentCheck] = await pool.execute(
          'SELECT id FROM users WHERE id = ? AND role = ?',
          [agentId, 'agent']
        );
        if (agentCheck.length === 0) {
          return res.status(400).json({ error: 'Assigned user must be a valid support agent' });
        }
        updates.push('assigned_to = ?');
        queryParams.push(agentId);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    queryParams.push(ticketId);
    const updateQuery = `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(updateQuery, queryParams);

    // Fetch updated ticket object
    const [updatedTickets] = await pool.execute(
      `SELECT t.*, u.name AS customer_name, agent.name AS assigned_agent_name 
       FROM tickets t 
       JOIN users u ON t.user_id = u.id 
       LEFT JOIN users agent ON t.assigned_to = agent.id 
       WHERE t.id = ?`,
      [ticketId]
    );

    return res.status(200).json({
      message: 'Ticket updated successfully',
      ticket: updatedTickets[0]
    });
  } catch (error) {
    console.error('[ticketController.updateTicket] Error:', error);
    return res.status(500).json({ error: 'Failed to update ticket' });
  }
}

/**
 * Delete a ticket.
 * Customer: can delete their own open ticket.
 * Agent: can delete any ticket.
 * DELETE /api/tickets/:id
 */
async function deleteTicket(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const [tickets] = await pool.execute(
      'SELECT id, user_id, status FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = tickets[0];

    if (req.user.role === 'customer') {
      if (ticket.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: Cannot delete another user ticket' });
      }
      if (ticket.status !== 'open') {
        return res.status(400).json({ error: 'Cannot delete a ticket that is in progress or closed' });
      }
    }

    await pool.execute('DELETE FROM tickets WHERE id = ?', [ticketId]);

    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('[ticketController.deleteTicket] Error:', error);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
}

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket
};
