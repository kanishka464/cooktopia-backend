const recipeService = require('../services/recipeService');
const { ApiResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllRecipe = asyncHandler(async (req, res) => {
    const recipes = await recipeService.getAllRecipe();
    return ApiResponse.success(res, 200, recipes, 'Recipes Retrived Successfully');
});

exports.insertRecipe = asyncHandler(async (req, res) => {
    const recipe = await recipeService.insertRecipe(req.body);
    return ApiResponse.success(res, 200, recipe, "Recipe entered successfully");
});

exports.likeRecipe = asyncHandler(async (req, res) => {
    const response = await recipeService.likeRecipe(req.body);
    if(response.success)
        return ApiResponse.success(res, 200, response.flag, response.message);
    else 
        return ApiResponse.error(res, 500, response.message);
});

exports.commentRecipe = asyncHandler(async (req, res) => {
    const response = await recipeService.commentRecipe(req.body);
    if(response.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
});

exports.getCommentByRecipeId = asyncHandler(async (req, res) => {
    console.log("get comment by recipe id", req);
    const response = await recipeService.getCommentByRecipeId(req.query.recipe_id);
    if(response.success) 
        return ApiResponse.success(res, 200, response.data, response.message);
    else 
        return ApiResponse.error(res, 500, response.message);
});

exports.getRecipeDetailsById = asyncHandler(async (req, res) => {
    const response = await recipeService.getRecipeDetailsById(req.query.recipe_id);
    if(response.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
});

exports.uploadRecipeImage = asyncHandler(async (req, res) => {
    const response = await recipeService.uploadRecipeImage(req);
    if(response.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else 
        return ApiResponse.error(res, 500, response.message);
})

exports.rateRecipe = asyncHandler(async (req, res) => {
    const response = await recipeService.rateRecipe(req.body);
    if(response.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})