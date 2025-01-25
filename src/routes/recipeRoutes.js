const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/getAllRecipe', recipeController.getAllRecipe);
router.post('/insertRecipe', recipeController.insertRecipe);
router.post('/like-recipe', recipeController.likeRecipe);

module.exports = router;