const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true,
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentedOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },  
}, {collection: 'comments'})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;