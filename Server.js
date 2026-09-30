import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from './routes/students.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('User Directory API is running!');
});

app.use('/students', studentRoutes);

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing from .env');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });