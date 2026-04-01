const { errorResponse } = require('../utils/response');

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return errorResponse(res, 'Not authorized as an admin', 403);
    }
};

module.exports = { admin };
