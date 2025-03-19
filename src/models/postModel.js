const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    postText:{
        type : String,
        required : true
    },

    postTitle:{
        type : String,
        required : true
    },

    created_at:{
        type : Date,
        default : Date.now
    },

    metaTags:{
        type : [String],
        required : false
    },

}, {collection: 'posts'});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;