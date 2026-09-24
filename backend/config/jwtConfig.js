const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_support_ticket_system_2026';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('[SECURITY WARNING] JWT_SECRET is not set in environment variables! Using default secret in production is unsafe.');
}

const JWT_OPTIONS = {
  expiresIn: '24h',
  issuer: 'support-ticket-system',
  audience: 'support-ticket-app',
  algorithm: 'HS256'
};

module.exports = {
  JWT_SECRET,
  JWT_OPTIONS
};
