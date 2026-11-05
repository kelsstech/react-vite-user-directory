
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
