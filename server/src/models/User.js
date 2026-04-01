const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    section: {
        type: String,
        required: function () { return this.role === 'student'; }
    },
    isVerified: {
        type: Boolean,
        default: true, // Auto-verify students for voting
    },
    hasVoted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
