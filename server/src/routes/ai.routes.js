const express = require('express');
const { getCandidateInsights } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/analyze', protect, getCandidateInsights);
router.get('/report', protect, require('../controllers/ai.controller').generateElectionReport);

module.exports = router;
