const express = require('express');
const router = express.Router();
const responsibleGamblingController = require('../controllers/responsibleGamblingController');
const auth = require('../middleware/auth');

router.use(auth);

// Betting limits routes
router.post('/limits', responsibleGamblingController.setBettingLimits);
router.get('/limits/:platform', responsibleGamblingController.getBettingLimits);

// Cooldown period routes
router.post('/cooldown', responsibleGamblingController.setCooldownPeriod);

// Behavior analysis routes
router.get('/analysis', responsibleGamblingController.getGamblingBehaviorAnalysis);

module.exports = router; 