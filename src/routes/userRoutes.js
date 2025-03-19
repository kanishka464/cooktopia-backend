const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', userController.getAllUsers);
router.post('/add', userController.insertOneUser);

// FOLLOW USER ROUTES
router.post('/follow/:id', authMiddleware ,userController.followUser);
router.post('/unfollow/:id', authMiddleware, userController.unfollowUser);

// USER PROFILE ROUTES
router.get('/profile', authMiddleware, userController.getUserProfileDetails);
router.get('/recent-activity', userController.getRecentActivity);

// UPDATE USER IMAGE
router.post('/update-profile-picture', authMiddleware, userController.updateProfilePicture);

module.exports = router;