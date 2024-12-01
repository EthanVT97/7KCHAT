const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const webhookVerification = require('../middleware/webhookVerification');

// Facebook Messenger webhook
router.get('/messenger', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.MESSENGER_VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Webhook endpoints with verification middleware
router.post('/messenger', webhookVerification.verifyMessenger, channelController.handleWebhook);
router.post('/viber', webhookVerification.verifyViber, channelController.handleWebhook);
router.post('/telegram', webhookVerification.verifyTelegram, channelController.handleWebhook);
router.post('/line', webhookVerification.verifyLine, channelController.handleWebhook);

module.exports = router; 