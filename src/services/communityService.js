const Post = require("../models/postmodel");
const mongoose = require('mongoose');

class CommunityService {
    async post(data) {
        try {
            const { user_id, postTitle, postText, metaTags } = data;
            const user_ObjectId = new mongoose.Types.ObjectId(user_id);
            

            const newPost = {
                postedBy: user_ObjectId,
                postTitle,
                postText,
                metaTags,
            }

            const post = new Post(newPost);
            const savedPost = await post.save();
            console.log("Comment created: ", savedPost);
            return { success: true, data:post, message: "Post added successfully" };
        } catch (error) {
            console.error('Error while commenting on a recipe', error);
            throw error;
        }
    }

    async listPost() {
        try{
            const posts = await Post.find().populate('postedBy', 'name').exec();
            return { success: true, data: posts, message: "Posts retrieved successfully" };
        } catch (error) {
            console.error('Error while fetching posts', error);
            throw error;
        }
    }
}

module.exports = new CommunityService();