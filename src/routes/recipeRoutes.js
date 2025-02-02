const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/getAllRecipe', recipeController.getAllRecipe);
router.post('/insertRecipe', recipeController.insertRecipe);
router.post('/like-recipe', recipeController.likeRecipe);
router.post('/comment-recipe', recipeController.commentRecipe);
router.get('/get-comment-by-recipeId', recipeController.getCommentByRecipeId);
router.get('/get-recipe-details', recipeController.getRecipeDetailsById);

module.exports = router;