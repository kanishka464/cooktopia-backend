const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const mongoose = require('mongoose');
const S3Client = require('@aws-sdk/client-s3').S3Client;
const PutObjectCommand = require('@aws-sdk/client-s3').PutObjectCommand;
const crypto = require('crypto');
const path = require('path');

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
            const user = await User.findById(recipeData.created_by);
            user.createdRecipes.push(savedRecipe._id);
            await user.save();
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
            const userToLikedRecipe = await User.findById(data?.user_id);

            if(!recipeToLiked) {
                return { success:false, message: "Recipe not found" };
            }

            const isUserAlreadyLiked = userToLikedRecipe.likedRecipes.includes(data?.recipe_id);

            if(isUserAlreadyLiked) {
                try {
                    recipeToLiked.likedByUser = recipeToLiked.likedByUser.filter(user => !user.equals(data?.user_id));
                    await recipeToLiked.save();

                    userToLikedRecipe.likedRecipes = userToLikedRecipe.likedRecipes.filter(recipe => !recipe.equals(data?.recipe_id));
                    await userToLikedRecipe.save();

                    return { success: true, message: "Recipe removed from liked recipe", flag: false };
                } catch (error) {
                    console.error('Error while unlike a recipe', error);
                    return { success: false, message: "An issue while unlike recipe" };
                }
                
            } else {
                try {
                    recipeToLiked.likedByUser.push(data?.user_id);
                    const response = await recipeToLiked.save();

                    userToLikedRecipe.likedRecipes.push(data?.recipe_id);
                    const saveLikedRecipeToUser = await userToLikedRecipe.save();

                    if(response && saveLikedRecipeToUser) {
                        return { success: true, message: "Recipe liked successfully", flag: true };
                    } else {
                        return { success: false, message: "An issue while like recipe" };
                    }
                } catch (error) {
                    console.error('Error while like a recipe', error);
                    return { success: false, message: "An issue while like recipe" };
                }
            }
        } catch (error) {
            console.error('Error while like a recipe', error);
            throw error;
        }
    }

    async commentRecipe(data) {
        try {
            const { user_id, recipe_id, commentText } = data;
            const recipe_ObjectId = new mongoose.Types.ObjectId(recipe_id);
            const user_ObjectId = new mongoose.Types.ObjectId(user_id);

            const recipeToComment = await Recipe.findById(recipe_ObjectId);
            console.log("recipe_id",recipe_id, recipe_ObjectId)
            console.log("recipeToComment: ", recipeToComment);

            if(!recipeToComment) {
                return { success: false, message: "Recipe not found" };
            }

            const newComment = {
                commentText,
                commentedBy: user_ObjectId,
                commentedOn: recipe_ObjectId,
            }

            const comment = new Comment(newComment);
            const savedComment = await comment.save();
            console.log("Comment created: ", savedComment);
            recipeToComment.comments.push(comment._id);
            await recipeToComment.save();
            return { success: true, data:comment, message: "Comment added successfully" };
        } catch (error) {
            console.error('Error while commenting on a recipe', error);
            throw error;
        }
    }

    async getCommentByRecipeId(recipe_id) {
        try {
            const recipe_ObjectId = new mongoose.Types.ObjectId(recipe_id);
            const comments = await Comment.find({commentedOn: recipe_ObjectId}).populate('commentedBy', 'name');
            const filteredComments = comments.map(({ commentText, created_at, commentedBy }) => ({
                commentText,
                created_at,
                commentedBy: commentedBy.name
            }));
            return { success: true, data: filteredComments, message: "Comments fetched successfully" };
        } catch (error) {
            console.error('Error while fetching comments', error);
            throw error;
        }
    }

    async getRecipeDetailsById(recipe_id) {
        try {
            const recipe_ObjectId = new mongoose.Types.ObjectId(recipe_id);
            const recipeDetails = await Recipe.findById(recipe_ObjectId)
                                    .select('-likedByUser -__v')
                                    .populate('created_by', 'name, -_id')
                                    .populate({
                                        path: 'comments',
                                        select: 'commentText created_at -_id',
                                        populate: { path: 'commentedBy', select: 'name -_id'}
                                    }).exec();

            if(recipeDetails) {
                const recipeDetailsObject = recipeDetails.toObject();

                const updatedDetails = await Recipe.find({
                    $or: [ 
                        {category: recipeDetails?.category}, 
                        {cuisines: recipeDetails?.cuisines}, 
                        {mealType: recipeDetails?.mealType}
                    ], _id: {$ne: recipe_ObjectId}
                }).limit(4).exec();

                recipeDetailsObject.similarRecipes = updatedDetails || [];
                return { success: true, data: recipeDetailsObject, message: "Recipe details fetched successfully"};
            } else {
                return { success: false, message: "Recipe details not found" };
            }

        } catch (error) {
            console.error('Error while fetching recipe details', error);
            throw error;
        }
    }

    async uploadRecipeImage(req) {
        try {
            if(!req.file) {
                return { success: false, message: "No file uploaded" };
            }
            
            
            const s3Client = new S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
              });

            // Generate unique filename
            const fileExtension = path.extname(req.file.originalname);
            const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;


            // Set up S3 upload parameters
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/${fileName}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            // Upload to S3
            await s3Client.send(new PutObjectCommand(uploadParams));

            // Generate the URL of the uploaded file
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

            return { success: true, data: fileUrl, message: "Recipe image uploaded successfully" };
        } catch (error) {
            console.error('Error uploading recipe image:', error);
            throw error;
        }
    }
}

module.exports = new RecipeService();