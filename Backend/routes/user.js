// routes/user.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { saveUser } = require('../controllers/userController');

const router = express.Router();

router.post('/save', verifyToken, saveUser);

module.exports = router;
