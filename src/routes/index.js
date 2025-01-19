const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

router.use('/users', userRoutes);

// Auth Routes
router.use('/auth', authRoutes);

module.exports = router;