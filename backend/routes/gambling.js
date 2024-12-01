const express = require('express');
const router = express.Router();
const gamblingController = require('../controllers/gamblingController');
const auth = require('../middleware/auth');

router.use(auth);

// Game-related routes
router.get('/:platform/live-games', gamblingController.getLiveGames);
router.get('/:platform/game/:gameId/status', gamblingController.getGameStatus);
router.get('/:platform/game/:gameId/odds', gamblingController.getOdds);

// Transaction routes
router.post('/:platform/transaction/:type', gamblingController.processTransaction);
router.get('/transactions/summary/:userId', gamblingController.getTransactionSummary);
router.get('/:platform/history/:userId', gamblingController.getBettingHistory);

// Promotion routes
router.get('/:platform/promotions', gamblingController.getPromotions);

module.exports = router; 