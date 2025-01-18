require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const routes = require('./routes');
const connectDB = require('./config/database');

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
// app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

module.exports = app