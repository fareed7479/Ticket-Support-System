const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

/**
 * Register a new customer user account.
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user with given email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password with bcrypt cost factor 10
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into database with default role 'customer'
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

    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('[authController.register] Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
}

/**
 * Log in existing user (Customer or Agent) and issue JWT.
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Fetch user record from database
    const [users] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Sign JWT token with minimum required payload
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_support_ticket_system_2026',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[authController.login] Error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}

module.exports = {
  register,
  login
};
