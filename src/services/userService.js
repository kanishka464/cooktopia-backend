const User = require('../models/userModel');
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const Recipe = require('../models/recipeModel');
const userAvatar = require('../utils/constants');
const type = require('../utils/constants');
class UserService {
    // Get all users
    async getUsers(filter = {}) {
        try {
            const users = await User.find(filter).sort({createdAt: -1});
            return users;
        } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
        }
    }


    async insertUser(userData) {
        try {
            // Create new user instance
            const picture = `https://api.dicebear.com/9.x/${type[Math.floor(Math.random()*type.length)]}/svg?seed=${userAvatar[Math.floor(Math.random()*userAvatar.length)]}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`
            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password:userData.password,
                picture: picture,
            });
    
            // Save to database
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    }

    async followUser(userData) {
        try {
            console.log("PARAMS", userData.params);
            const userToFollow = await User.findById(userData?.params?.id);
            const currentUser = await User.findById(userData?.user?.userId);

            if(!userToFollow || !currentUser) {
                return { success: false, message: "User not found" };
            }

            // Check if user already following
            if(currentUser.following.includes(userToFollow._id)) {
                return { success: false, message: "User already followed" };
            }

            // Add to following and follower list
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            await currentUser.save();
            await userToFollow.save();

            return { success: true, data:{}, message: "User followed successfully" };
        } catch (error) {
            console.error('Error while following user', error );
            return { success: false, message: "An issue while following user" };
        }
    }

    async unfollowUser(userData) {
        try {
            const userToUnfollow = await User.findById(userData?.params.id);
            const currentUser = await User.findById(userData?.user?.userId);

            if(!userToUnfollow || !currentUser) {
                return { success: false, message: "User not found" };
            }

            // check if user already unfollowed or not following
            if(!currentUser.following.includes(userToUnfollow._id)) {
                return { success: false, message: "User not followed yet" };
            }

            // Remove from following and followers list
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
            userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());

            await currentUser.save();
            await userToUnfollow.save();

            return { success: true, data: null, message: "User unfollowed successfully" };
        } catch (error) {
            console.error('Error while unfollowing user', error);
            return { success: false, message: "An issue while unfollowing user" };
        }
    }

    async getUserProfileDetails(userData) {
        const { userId } = userData.query;
        console.log("User id ----", userId);
        try {
            const userDetails = await User.findById(userId ? userId : userData?.user?.userId)
                                        .populate({
                                            path: 'likedRecipes',
                                            select: '-steps -likedByUser -comments',
                                            populate: {
                                                path: 'created_by',
                                                select: 'name'
                                            }
                                        })
                                        .populate({
                                            path: 'followers',
                                            select: 'name picture'
                                        })
                                        .populate({
                                            path: 'following',
                                            select: 'name picture'
                                        })
                                        .populate({
                                            path: 'createdRecipes',
                                            select: '-steps',
                                        })
                                        .exec();

            if(userDetails) {
                return { success: true, data: userDetails, message: "User profile details fetched successfully" };
            } else {
                return { success: false, message: "User details not found" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "An issue while fetching user profile details" };
        }
    }

    async getRecentActivity(data) {
        const { userId } = data.query;
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);

            // Fetch user-created recipes
            const userRecipes = await Recipe.find({ created_by: userObjectId }).select("_id recipeName");
    
            const recipeIds = userRecipes.map(recipe => recipe._id);
    
            // Fetch recent comments on user's recipes
            const recentComments = await Comment.find({ commentedOn: { $in: recipeIds } })
                .populate("commentedBy", "name picture _id")
                .populate("commentedOn", "recipeName")
                .sort({ created_at: -1 })
                .limit(5);
    
            // Fetch recent likes on user's recipes
            const recentLikes = await User.find({ likedRecipes: { $in: recipeIds } })
                .select("name likedRecipes picture _id")
                .populate({
                    path: "likedRecipes",
                    match: { _id: { $in: recipeIds } },
                    select: "recipeName created_at"
                })
                .sort({ createdAt: -1 })
                .limit(5);
    
            // Fetch recent followers
            const recentFollowers = await User.find({ following: userObjectId })
                .select("name createdAt picture _id")
                .sort({ createdAt: -1 })
                .limit(5);
    
            // Format activities
            const activities = [];
    
            // Add comment activities
            recentComments.forEach(comment => {
                activities.push({
                    type: "comment",
                    picture: comment.commentedBy.picture,
                    userId: comment.commentedBy._id,
                    message: `${comment.commentedBy.name} commented on your recipe ${comment.commentedOn.recipeName}`,
                    date: comment.created_at
                });
            });
    
            // Add like activities
            recentLikes.forEach(user => {
                user.likedRecipes.forEach(recipe => {
                    activities.push({
                        type: "like",
                        picture: user.picture,
                        userId: user._id,
                        message: `${user.name} liked your recipe ${recipe.recipeName}`,
                        date: recipe.created_at
                    });
                });
            });
    
            // Add follower activities
            recentFollowers.forEach(follower => {
                activities.push({
                    type: "follow",
                    picture: follower.picture,
                    userId: follower._id,
                    message: `${follower.name} started following you`,
                    date: follower.createdAt
                });
            });
    
            // Sort by date and return latest 5 activities
            activities.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if(activities) {
                return { success: true, data: activities?.slice(0, 5), message: 'Activities fetched successfully' };
            } else {
                return { success: false, message: 'An issue occurred while fetching activities' };
            }

    } catch (error) {
            console.log(error);
            return { success: false, message: 'An issue while getting recent Activities' };
        }
    }

    async updateProfilePicture(data) {
        try {
            const { type, avtaar} = data?.body;

            const user = await User.findById(data?.user?.userId);
            user.picture = `https://api.dicebear.com/9.x/${type}/svg?seed=${avtaar}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`
            const updatedUser = await user.save();
            console.log("Updated User", updatedUser);
            return { success: true, data: updatedUser.picture, message: "" };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error occurred while updating profile picture" };
        }
    }
}

module.exports =  new UserService();