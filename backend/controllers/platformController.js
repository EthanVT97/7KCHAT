const Platform = require('../models/Platform');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const platformIntegrationService = require('../services/platformIntegrationService');
const aiService = require('../services/aiService');

exports.createPlatform = async (req, res) => {
    try {
        const { name, type, apiConfig, settings } = req.body;
        
        const platform = await Platform.create({
            name,
            type,
            apiConfig,
            settings
        });

        res.status(201).json(platform);
    } catch (error) {
        res.status(500).json({ message: 'Error creating platform', error: error.message });
    }
};

exports.updatePlatformSettings = async (req, res) => {
    try {
        const { platformId } = req.params;
        const { settings } = req.body;

        const platform = await Platform.findByIdAndUpdate(
            platformId,
            { settings },
            { new: true }
        );

        res.json(platform);
    } catch (error) {
        res.status(500).json({ message: 'Error updating platform settings', error: error.message });
    }
};

exports.getPlatformAnalytics = async (req, res) => {
    try {
        const { platformId } = req.params;
        const { startDate, endDate } = req.query;

        const analytics = await Chat.aggregate([
            {
                $match: {
                    platform: platformId,
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'messages'
                }
            },
            {
                $group: {
                    _id: '$platform',
                    totalChats: { $sum: 1 },
                    totalMessages: { $sum: { $size: '$messages' } },
                    autoReplies: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$messages',
                                    as: 'message',
                                    cond: { $eq: ['$$message.messageType', 'auto-reply'] }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.json(analytics[0] || { totalChats: 0, totalMessages: 0, autoReplies: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platform analytics', error: error.message });
    }
};

exports.getCustomerSentimentAnalysis = async (req, res) => {
    try {
        const { platformId } = req.params;
        const { chatId } = req.query;

        const messages = await Message.find({ chatId })
            .sort('createdAt')
            .select('content sender createdAt');

        const sentiment = await aiService.analyzeCustomerSentiment(messages);

        res.json(sentiment);
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing sentiment', error: error.message });
    }
};

exports.managePlatformAutoReplies = async (req, res) => {
    try {
        const { platformId } = req.params;
        const { templates } = req.body;

        const platform = await Platform.findById(platformId);
        platform.settings.autoReply.templates = templates;
        await platform.save();

        res.json(platform);
    } catch (error) {
        res.status(500).json({ message: 'Error managing auto-replies', error: error.message });
    }
}; 