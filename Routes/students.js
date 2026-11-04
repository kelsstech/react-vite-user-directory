const express = require('express');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Get all students (requires a valid JWT)
router.get('/', requireAuth, (req, res) => {
    res.status(200).json({
        message: 'Students retrieved successfully',
        user: req.user
    });
});

// Delete a student (requires a valid JWT)
router.delete('/:id', requireAuth, (req, res) => {
    const studentId = req.params.id;

    res.status(200).json({
        message: `Student ${studentId} deleted successfully`
    });
});

module.exports = router;