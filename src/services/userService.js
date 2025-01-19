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
}

module.exports =  new UserService();