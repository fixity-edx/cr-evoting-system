const express = require('express');
const { applyForCandidacy, getCandidates, getPendingCandidates, approveCandidate, rejectCandidate } = require('../controllers/candidate.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/apply', protect, applyForCandidacy);
router.get('/', getCandidates); // Public/Student can see approved candidates
router.get('/pending', protect, admin, getPendingCandidates);
router.put('/:id/approve', protect, admin, approveCandidate);
router.delete('/:id/reject', protect, admin, rejectCandidate);

module.exports = router;
