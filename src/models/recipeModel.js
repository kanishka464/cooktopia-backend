const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipeName:{
        type: String,
        required: true,
        trim:true,
    },
    cookingTime: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["Veg", "Non-Veg", "Egg"],
        required:true,
    },
    mealType: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"],
        required:true,
    },
    cuisines: {
        type: String,
        enum: ["Indian", "Chinese", "Italian", "French", "German", "British", "Mexican", "Turkish", "Caribbean", "Thai"],
        required: true,
    },
    ratingAverage: {
        type: String,
    },
    serves: {
        type: Number,
        required: true,
    },
    calories: {
        type: String,
        required: true,
    },
    nutritionDetails: {
        type: [String],
    },
    likedByUser: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        // unique: true,
        default: [],
        required:false,
    },
    steps:{
        type: [String],
        required:true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {collection: 'recipesCollection'});


const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;