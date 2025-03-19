const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
    }],
    createdRecipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    likedRecipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    picture: {
      type: String,
      required: false,
      trim: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref:'UserProfile'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {collection: 'users'});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
  
    try {
      // Generate salt
      const salt = await bcrypt.genSalt(10);
      
      // Hash password with salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Method to verify password
  userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;