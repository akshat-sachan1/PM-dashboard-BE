const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateAuth } = require('../middleware/validate');

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);

module.exports = router;