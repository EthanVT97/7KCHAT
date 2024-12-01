const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platformController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All platform routes require authentication
router.use(auth);

// Platform management (admin only)
router.post('/create', adminAuth, platformController.createPlatform);
router.put('/:platformId/settings', adminAuth, platformController.updatePlatformSettings);
router.post('/:platformId/auto-replies', adminAuth, platformController.managePlatformAutoReplies);

// Analytics and reports
router.get('/:platformId/analytics', platformController.getPlatformAnalytics);
router.get('/:platformId/sentiment', platformController.getCustomerSentimentAnalysis);

module.exports = router; 