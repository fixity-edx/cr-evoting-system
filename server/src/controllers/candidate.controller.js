const Candidate = require('../models/Candidate');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

// Apply for candidacy (Student)
const applyForCandidacy = async (req, res) => {
    try {
        const { manifesto, position } = req.body;
        const userId = req.user._id;

        // Check if already a candidate
        const existingCandidate = await Candidate.findOne({ user: userId });
        if (existingCandidate) {
            return errorResponse(res, 'You have already applied for candidacy', 400);
        }

        const candidate = await Candidate.create({
            user: userId,
            manifesto,
            position,
        });

        successResponse(res, candidate, 'Candidacy application submitted successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

// Get all candidates (Public/Authenticated)
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: true }).populate('user', 'name section email');
        successResponse(res, candidates);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

// Get pending candidates (Admin)
const getPendingCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: false }).populate('user', 'name section email');
        successResponse(res, candidates);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

// Approve candidate (Admin)
const approveCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return errorResponse(res, 'Candidate not found', 404);
        }

        candidate.isApproved = true;
        await candidate.save();

        successResponse(res, candidate, 'Candidate approved');
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

// Reject candidate (Admin)
const rejectCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return errorResponse(res, 'Candidate not found', 404);
        }
        await candidate.deleteOne();
        successResponse(res, null, 'Candidate rejected and removed');
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
}

module.exports = { applyForCandidacy, getCandidates, getPendingCandidates, approveCandidate, rejectCandidate };
