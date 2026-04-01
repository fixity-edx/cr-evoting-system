const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    manifesto: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        default: 'Class Representative',
    },
    votesCount: {
        type: Number,
        default: 0,
    },
    isApproved: { // Admin approval for candidacy
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
