const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT Bearer token.
 * Populates req.user with decoded token payload if valid.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_support_ticket_system_2026', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware for Role-Based Access Control (RBAC).
 * Enforces that req.user.role matches allowed roles.
 * @param {...string} allowedRoles - Roles allowed to access the route ('customer', 'agent')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
