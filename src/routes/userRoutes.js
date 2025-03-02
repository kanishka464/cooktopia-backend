const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', userController.getAllUsers);
router.post('/add', userController.insertOneUser);

// FOLLOW USER ROUTES
router.post('/follow/:id', authMiddleware ,userController.followUser);
router.post('/unfollow/:id', authMiddleware, userController.unfollowUser);

module.exports = router;