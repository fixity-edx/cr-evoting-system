const User = require('../models/User');
const { hashPassword, matchPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
    try {
        const { name, email, password, role, section } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return errorResponse(res, 'User already exists', 400);
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            section
        });

        if (user) {
            successResponse(res, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            }, 'User registered successfully', 201);
        } else {
            errorResponse(res, 'Invalid user data', 400);
        }
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await matchPassword(password, user.password))) {
            successResponse(res, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            errorResponse(res, 'Invalid email or password', 401);
        }
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        successResponse(res, user);
    } catch (error) {
        errorResponse(res, error.message, 500, error);
    }
};

module.exports = { register, login, getMe };
