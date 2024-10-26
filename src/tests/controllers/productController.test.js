const { createProduct } = require('../../../src/controllers/productController');
const { pool } = require('../../../src/config/db');

jest.mock('../../../src/config/db', () => ({
    pool: {
      query: jest.fn().mockResolvedValue({ rows: [] }) 
    }
  }));

  
describe('Product Controller', () => {
  it('should create a product', async () => {
    const req = {
      body: {
        name: 'Product Name',
        category: 'Category',
        price: 10.5,
        stock: 5,
        description: 'Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    pool.query.mockResolvedValue({ rows: [{ id: 1, ...req.body }] });

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
  });
});