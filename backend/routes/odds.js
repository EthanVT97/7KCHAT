const express = require('express');
const router = express.Router();
const oddsController = require('../controllers/oddsController');
const auth = require('../middleware/auth');

router.use(auth);

// Real-time odds subscription (SSE)
router.get('/:platform/game/:gameId/subscribe', oddsController.subscribeToOdds);

// Get latest odds
router.get('/:platform/game/:gameId', oddsController.getLatestOdds);

module.exports = router; 