const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const recipeRoutes = require('./recipeRoutes');

router.use('/users', userRoutes);

// Auth Routes
router.use('/auth', authRoutes);

// Recipe Routes
router.use('/recipe', recipeRoutes);

module.exports = router;