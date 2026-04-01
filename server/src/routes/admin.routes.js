const express = require('express');
const { getDashboardStats, getPendingUsers, approveUser } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users/pending', protect, admin, getPendingUsers);
router.put('/users/:id/approve', protect, admin, approveUser);

module.exports = router;
