const { errorResponse } = require('../utils/response');

const checkVoteEligibility = (req, res, next) => {
    if (req.user && !req.user.hasVoted) {
        next();
    } else if (req.user.hasVoted) {
        return errorResponse(res, 'You have already voted', 400);
    } else {
        return errorResponse(res, 'Not eligible to vote', 403);
    }
};

module.exports = { checkVoteEligibility };
