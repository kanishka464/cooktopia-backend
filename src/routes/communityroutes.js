const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/post', communityController.post);
router.get('/list-post', communityController.listPost);

module.exports = router;