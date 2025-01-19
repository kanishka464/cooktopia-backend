const User = require('../models/userModel');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    // Login 
    async login(email, password) {
        try {
            const user = await User.findOne({ email });
            if(!user) {
                // throw new Error('Invalid Credentials');

                return {
                    success:false,
                    data:null,
                }
            }

            // Check Password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return {
                    success:false,
                    data:null,
                }

                // throw new Error('Invalid Credentials');

            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const userData = user.toObject();
            delete userData.password;

            return {
                success:true,
                data: {
                    user:userData,
                    token
                }
            };

        } catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = new AuthService();