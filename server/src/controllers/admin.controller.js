const User = require('../models/User');
const Candidate = require('../models/Candidate');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalVotes = await User.countDocuments({ hasVoted: true });
        const totalCandidates = await Candidate.countDocuments({ isApproved: true });

        successResponse(res, {
            totalUsers,
            totalVotes,
            totalCandidates
        });
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: false, role: 'student' });
        successResponse(res, users);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return errorResponse(res, 'User not found', 404);

        user.isVerified = true;
        await user.save();
        successResponse(res, user, 'User verifed successfully');
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

module.exports = { getDashboardStats, getPendingUsers, approveUser };
