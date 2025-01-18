const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect( process.env.MONGODB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log('Connected to the cooktopia database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });
};

module.exports = connectDB;