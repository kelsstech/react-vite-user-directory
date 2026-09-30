import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.json({
            message: 'Student deleted successfully',
            deletedStudent: student
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

export default router;