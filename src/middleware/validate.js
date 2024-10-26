const { body } = require('express-validator');

const validateProduct = [
  body('name').notEmpty().trim().escape(),
  body('category').notEmpty().trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().trim().escape()
];

const validateAuth = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

module.exports = {
  validateProduct,
  validateAuth
};