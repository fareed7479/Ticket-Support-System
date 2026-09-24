const pool = require('../db');

/**
 * Helper function to verify ticket access permission.
 * Customer can access only their ticket; Agent can access any ticket.
 */
async function checkTicketAccess(ticketId, user) {
  const [tickets] = await pool.execute(
    'SELECT id, user_id FROM tickets WHERE id = ?',
    [ticketId]
  );

  if (tickets.length === 0) {
    return { status: 404, error: 'Ticket not found' };
  }

  const ticket = tickets[0];
  if (user.role === 'customer' && ticket.user_id !== user.id) {
    return { status: 403, error: 'Forbidden: Access denied to comments for this ticket' };
  }

  return { status: 200, ticket };
}

/**
 * Get comments for a given ticket.
 * GET /api/tickets/:id/comments
 */
async function getComments(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const accessCheck = await checkTicketAccess(ticketId, req.user);
    if (accessCheck.status !== 200) {
      return res.status(accessCheck.status).json({ error: accessCheck.error });
    }

    const [comments] = await pool.execute(
      `SELECT 
        c.id,
        c.ticket_id,
        c.user_id,
        c.comment,
        c.created_at,
        u.name AS user_name,
        u.role AS user_role
      FROM ticket_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC`,
      [ticketId]
    );

    return res.status(200).json(comments);
  } catch (error) {
    console.error('[commentController.getComments] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket comments' });
  }
}

/**
 * Add a comment to a ticket.
 * POST /api/tickets/:id/comments
 */
async function addComment(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const accessCheck = await checkTicketAccess(ticketId, req.user);
    if (accessCheck.status !== 200) {
      return res.status(accessCheck.status).json({ error: accessCheck.error });
    }

    const { comment } = req.body;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)',
      [ticketId, userId, comment.trim()]
    );

    const [newComments] = await pool.execute(
      `SELECT 
        c.id,
        c.ticket_id,
        c.user_id,
        c.comment,
        c.created_at,
        u.name AS user_name,
        u.role AS user_role
      FROM ticket_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: newComments[0]
    });
  } catch (error) {
    console.error('[commentController.addComment] Error:', error);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
}

module.exports = {
  getComments,
  addComment
};
