const { validateProduct, validateAuth } = require('../../../src/middleware/validate');
const { validationResult } = require('express-validator');

describe('Validation Middleware', () => {
  it('should validate product fields correctly', async () => {
    const req = {
      body: {
        name: 'Product Name',
        category: 'Category',
        price: 10.5,
        stock: 5,
        description: 'Description'
      }
    };
    const res = {};
    const next = jest.fn();

    await validateProduct.forEach(validation => validation(req, res, next));
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should validate auth fields correctly', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'password123'
      }
    };
    const res = {};
    const next = jest.fn();

    await validateAuth.forEach(validation => validation(req, res, next));
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });
});