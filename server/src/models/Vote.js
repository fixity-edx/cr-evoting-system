const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    }
}, { timestamps: true });

// Prevent duplicate votes implemented at schema level as backup (though hasVoted flag in User is primary check)
voteSchema.index({ voter: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
