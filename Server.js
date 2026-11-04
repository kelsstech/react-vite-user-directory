import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Check MongoDB connection string
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

// Main route
app.get('/', (req, res) => {
    res.send('User Directory API is running!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Check if MongoDB URI exists
if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing from .env');
    process.exit(1);
}

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });