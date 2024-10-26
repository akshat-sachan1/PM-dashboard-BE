const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, category, price, stock, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO products (name, category, price, stock, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, price, stock, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let query = 'SELECT * FROM products';
    const queryParams = [];

    // Add category filter
    if (category) {
      query += ' WHERE category = $1';
      queryParams.push(category);
    }

    // Add search functionality
    if (search) {
      query += queryParams.length ? ' AND' : ' WHERE';
      query += ` name ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    if (sort) {
      const [field, order] = sort.split(':');
      query += ` ORDER BY ${field} ${order.toUpperCase()}`;
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, category, price, stock, description } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, category = $2, price = $3, stock = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, category, price, stock, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};