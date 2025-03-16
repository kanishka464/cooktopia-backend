const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ratedOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },  
}, {collection: 'recipeRatings'})

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;