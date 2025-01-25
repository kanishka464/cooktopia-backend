const Recipe = require('../models/recipeModel');
const mongoose = require('mongoose');

class RecipeService {
    async getAllRecipe(filter = {}) {
        try {
            const recipes = await Recipe.find(filter).populate('created_by', 'name').sort({createdAt: -1});
            return recipes;
        } catch (err) {
            throw new Error(`Error fetching recipes: ${err.message}`);
        }
    }

    async insertRecipe(recipeData) {
        try {
            recipeData.created_by = new mongoose.Types.ObjectId(recipeData.created_by);
            const newRecipe = new Recipe(recipeData);
            const savedRecipe = await newRecipe.save();
            return savedRecipe;
        } catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    }

    async likeRecipe(data) {
        try {
            // const { user_id, recipe_id } = data;
            // const recipe_ObjectId = new mongoose.Types.ObjectId(recipe_id);

            const recipeToLiked = await Recipe.findById(data?.recipe_id);

            if(!recipeToLiked) {
                return { success:false, message: "Recipe not found" };
            }

            const isUserAlreadyLiked = recipeToLiked.likedByUser.includes(data?.user_id);

            if(isUserAlreadyLiked) {
                recipeToLiked.likedByUser = recipeToLiked.likedByUser.filter(user => !user.equals(data?.user_id));
                await recipeToLiked.save();

                return { success: true, message: "Recipe removed from liked recipe", flag: false };
            } else {
                recipeToLiked.likedByUser.push(data?.user_id);
                const response = await recipeToLiked.save();

                if(response) {
                    return { success: true, message: "Recipe liked successfully", flag: true };
                } else {
                    return { success: false, message: "An issue while like recipe" };
                }
            }
        } catch (error) {
            console.error('Error while like a recipe', error);
            throw error;
        }
    }
}

module.exports = new RecipeService();