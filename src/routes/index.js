const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const recipeRoutes = require('./recipeRoutes');
const communityRoutes = require('./communityroutes');

router.use('/users', userRoutes);

// Auth Routes
router.use('/auth', authRoutes);

// Recipe Routes
router.use('/recipe', recipeRoutes);

//coummunity routes
router.use('/community', communityRoutes);

module.exports = router;