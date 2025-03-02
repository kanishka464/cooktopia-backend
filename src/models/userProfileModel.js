const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required:true,
    },
    mobile: {
        type: String,
        required: false,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    }
}, {userProfileDetails});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;