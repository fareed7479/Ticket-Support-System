const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_OPTIONS } = require('../config/jwtConfig');

/**
 * Production-grade JWT Authentication Middleware.
 * Extracts, validates, and decodes Bearer token from Authorization header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authentication token required',
      code: 'TOKEN_MISSING'
    });
  }

  // Regex check to ensure format is strictly: "Bearer <token>"
  const bearerRegex = /^Bearer\s+(.+)$/i;
  const match = authHeader.trim().match(bearerRegex);

  if (!match) {
    return res.status(401).json({
      error: 'Invalid Authorization header format. Format must be: Bearer <token>',
      code: 'INVALID_HEADER_FORMAT'
    });
  }

  const token = match[1];

  jwt.verify(
    token,
    JWT_SECRET,
    {
      issuer: JWT_OPTIONS.issuer,
      audience: JWT_OPTIONS.audience,
      algorithms: [JWT_OPTIONS.algorithm]
    },
    (err, decodedUser) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Authentication token has expired. Please log in again.',
            code: 'TOKEN_EXPIRED'
          });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            error: 'Invalid authentication token signature',
            code: 'TOKEN_INVALID'
          });
        }
        return res.status(401).json({
          error: 'Authentication failed',
          code: 'AUTH_FAILED'
        });
      }

      // Attach verified user payload to request
      req.user = decodedUser;
      next();
    }
  );
}

/**
 * Production Role-Based Access Control (RBAC) Middleware.
 * @param {...string} allowedRoles - Allowed user roles ('customer', 'agent')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required before checking permissions',
        code: 'UNAUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles`,
        code: 'FORBIDDEN_ROLE'
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
