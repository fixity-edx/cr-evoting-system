const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const castVote = async (req, res) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
        const { candidateId } = req.body;
        const voterId = req.user._id;

        // Double check eligibility (redundant but safe)
        const user = await User.findById(voterId).session(session);
        if (user.hasVoted) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 'You have already voted', 400);
        }

        const candidate = await Candidate.findById(candidateId).session(session);
        if (!candidate) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 'Candidate not found', 404);
        }

        // Create vote
        await Vote.create([{ voter: voterId, candidate: candidateId }], { session });

        // Increment candidate votes
        candidate.votesCount = (candidate.votesCount || 0) + 1;
        await candidate.save({ session });

        // Mark user as voted
        user.hasVoted = true;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        successResponse(res, null, 'Vote cast successfully');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        errorResponse(res, error.message, 500, error);
    }
};

const getResults = async (req, res) => {
    try {
        // Ideally should be cached or specialized query
        const candidates = await Candidate.find({ isApproved: true })
            .select('user votesCount position')
            .populate('user', 'name')
            .sort({ votesCount: -1 });

        successResponse(res, candidates);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

module.exports = { castVote, getResults };
