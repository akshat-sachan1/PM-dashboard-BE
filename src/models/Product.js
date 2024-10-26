const pool = require('../config/db');

const Product = {
  async create({ name, category, price, stock }) {
    const result = await pool.query(
      'INSERT INTO products (name, category, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, price, stock]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  },
  async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  },
  async update(id, fields) {
    const { name, category, price, stock } = fields;
    const result = await pool.query(
      'UPDATE products SET name=$1, category=$2, price=$3, stock=$4 WHERE id=$5 RETURNING *',
      [name, category, price, stock, id]
    );
    return result.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return { message: 'Product deleted successfully' };
  },
};

module.exports = Product;
