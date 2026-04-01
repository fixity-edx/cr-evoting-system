const express = require('express');
const { castVote, getResults } = require('../controllers/vote.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkVoteEligibility } = require('../middleware/vote.middleware');

const router = express.Router();

router.post('/', protect, checkVoteEligibility, castVote);
router.get('/results', getResults);

module.exports = router;
