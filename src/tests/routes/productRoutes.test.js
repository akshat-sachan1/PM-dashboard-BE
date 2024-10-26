const request = require('supertest');
const express = require('express');
const productRoutes = require('../../../src/routes/productRoutes');
const { pool } = require('../../../src/config/db');

jest.mock('../../../src/middleware/auth', () => (req, res, next) => next());
jest.mock('../../../src/config/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  it('should create a product', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Product Name' }] });

    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Product Name',
        category: 'Category',
        price: 10.5,
        stock: 5,
        description: 'Description'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Product Name');
  });

  it('should get all products', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Product Name' }] });

    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Product Name' }]);
  });
});