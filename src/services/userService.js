const User = require('../models/userModel');

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
            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password:userData.password,
                // Add any other fields your schema requires
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

            return { success: true, data:null, message: "User followed successfully" };
        } catch (error) {
            console.error('Error while following user', error );
            return { success: false, message: "An issue while following user" };
        }
    }

    async unfollowUser(userData) {
        try {
            const userToUnfollow = await User.findById(req.params.id);
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
}

module.exports =  new UserService();