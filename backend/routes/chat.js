const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all chat routes

router.post('/create', chatController.createChat);
router.post('/message/send', chatController.sendMessage);
router.get('/:chatId/history', chatController.getChatHistory);

module.exports = router; 