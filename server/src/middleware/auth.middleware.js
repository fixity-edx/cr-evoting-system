const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return errorResponse(res, 'User not found', 404);
            }
            next();
        } catch (error) {
            console.error(error);
            return errorResponse(res, 'Not authorized, token failed', 401);
        }
    }

    if (!token) {
        return errorResponse(res, 'Not authorized, no token', 401);
    }
};

module.exports = { protect };
