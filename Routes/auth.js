const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            password.length < 8
        ) {
            return res.status(400).json({
                error: 'A valid email and a password of at least 8 characters are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the email already exists
        const existing = await User.findOne({
            email: normalizedEmail
        });

        if (existing) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user
        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword
        });

        // Never return the password
        res.status(201).json({
            id: user._id,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        // Handle duplicate email index errors
        if (err.code === 11000) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        console.error('Registration error:', err.message);

        res.status(500).json({
            error: 'Registration failed'
        });
    }
});


// Log in an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        // Use the same message for an unknown email
        // and an incorrect password
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');

            return res.status(500).json({
                error: 'Authentication service is not configured'
            });
        }

        // Create the JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            token
        });

    } catch (err) {
        console.error('Login error:', err.message);

        res.status(500).json({
            error: 'Login failed'
        });
    }
});

module.exports = router;