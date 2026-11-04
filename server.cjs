const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./Routes/auth');
const studentRoutes = require('./Routes/students');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('User Directory API is running!');
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Student routes
app.use('/api/students', studentRoutes);

// Check environment variables and connect to MongoDB
async function startServer() {
    if (!process.env.MONGO_URI) {
        console.error('ERROR: MONGO_URI is missing from .env');
        process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
        console.error('ERROR: JWT_SECRET is missing from .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

startServer();