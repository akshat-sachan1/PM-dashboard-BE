const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../src/routes/authRoutes');
const { pool } = require('../../../src/config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../../../src/config/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token')
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  it('should register a user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); 
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); 

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token', 'test-token');
  });

  it('should login a user', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'user@example.com', password: await bcrypt.hash('password123', 10) }]
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'test-token');
  });
});