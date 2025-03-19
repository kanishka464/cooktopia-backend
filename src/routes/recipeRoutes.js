const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
      }
      cb(null, true);
    },
});
  

router.get('/getAllRecipe', recipeController.getAllRecipe);
router.post('/insertRecipe', recipeController.insertRecipe);
router.post('/like-recipe', recipeController.likeRecipe);
router.post('/comment-recipe', recipeController.commentRecipe);
router.get('/get-comment-by-recipeId', recipeController.getCommentByRecipeId);
router.get('/get-recipe-details', recipeController.getRecipeDetailsById);
router.post('/upload-recipe-image', upload.single("image"), recipeController.uploadRecipeImage);
router.post('/rate-recipe', recipeController.rateRecipe);
router.get('/recipe-search', recipeController.searchRecipe);

module.exports = router;