/**
 * Simple, clean request body validation functions.
 * Returns HTTP 400 Bad Request if validation rules fail.
 */

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  next();
}

function validateTicket(req, res, next) {
  const { subject, description, priority } = req.body;

  if (!subject || typeof subject !== 'string' || subject.trim() === '') {
    return res.status(400).json({ error: 'Ticket subject is required' });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'Ticket description is required' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  next();
}

function validateComment(req, res, next) {
  const { comment } = req.body;

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ error: 'Comment text cannot be empty' });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateTicket,
  validateComment
};
