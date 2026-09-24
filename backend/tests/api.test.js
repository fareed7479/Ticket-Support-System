const request = require('supertest');
const app = require('../server');

describe('Support Ticket System API Tests', () => {

  // 1. Authentication Tests
  describe('Authentication Endpoints', () => {
    test('POST /api/auth/login - invalid credentials returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrong_password_123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid email or password');
    });

    test('GET /api/tickets - unauthenticated request returns 401', async () => {
      const res = await request(app).get('/api/tickets');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Authentication token required');
    });
  });

  // 2. Validation Tests
  describe('Validation Checks', () => {
    test('POST /api/auth/register - invalid email returns 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email-format',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('POST /api/tickets - missing authentication header returns 401', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          subject: 'Test Ticket',
          description: 'Description'
        });

      expect(res.status).toBe(401);
    });

    test('GET /api/users - unauthenticated request returns 401', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).toBe(401);
    });
  });
});
