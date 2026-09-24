const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { JWT_SECRET, JWT_OPTIONS } = require('../config/jwtConfig');

/**
 * Helper to generate a production-grade signed JWT token.
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
}

/**
 * Register a new customer user account.
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password using bcrypt (salt rounds = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new customer user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), cleanEmail, passwordHash, 'customer']
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail,
      role: 'customer'
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('[authController.register] Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
}

/**
 * Log in existing user (Customer or Agent) and return JWT.
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = generateToken(userData);

    return res.status(200).json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('[authController.login] Error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}

/**
 * Get current authenticated user details from JWT.
 * GET /api/auth/me
 */
async function getCurrentUser(req, res) {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User account not found' });
    }

    return res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('[authController.getCurrentUser] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
};
