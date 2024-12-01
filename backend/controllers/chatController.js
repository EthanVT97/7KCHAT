const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const translationService = require('../services/translationService');

exports.createChat = async (req, res) => {
    try {
        const { participants, platform, type } = req.body;

        const chat = await Chat.create({
            participants,
            platform,
            type,
            metadata: {
                language: req.body.language || 'my',
                lastActivity: new Date()
            }
        });

        await chat.populate('participants', 'username email');

        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Error creating chat', error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content, type = 'text' } = req.body;
        const senderId = req.user.id;

        // Detect language
        const detectedLanguage = await translationService.detectLanguage(content);

        const message = await Message.create({
            sender: senderId,
            content,
            type,
            language: detectedLanguage,
            metadata: {
                platform: req.body.platform,
                translated: false,
                originalContent: content
            }
        });

        // Update chat metadata
        await Chat.findByIdAndUpdate(chatId, {
            $inc: { 'metadata.messageCount': 1 },
            $set: { 'metadata.lastActivity': new Date() }
        });

        await message.populate('sender', 'username');

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'username');

        const total = await Message.countDocuments({ chatId });

        res.json({
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ message: 'Error getting chat history', error: error.message });
    }
}; 