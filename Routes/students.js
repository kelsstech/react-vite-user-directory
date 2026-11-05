
const express = require('express');
const requireAuth = require('../middleware/auth');
const Student = require('../models/Student');

const router = express.Router();

// Get all students (requires a valid JWT)
router.get('/', requireAuth, async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });

        res.status(200).json({
            message: 'Students retrieved successfully',
            students
        });
    } catch (error) {
        console.error('Error retrieving students:', error);
        res.status(500).json({
            error: 'Failed to retrieve students'
        });
    }
});

// Delete a student (requires a valid JWT)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid student ID'
            });
        }

        console.error('Error deleting student:', error);
        res.status(500).json({
            error: 'Failed to delete student'
        });
    }
});

module.exports = router;
