const ViberService = require('../services/channelIntegration/viberService');
const TelegramService = require('../services/channelIntegration/telegramService');
const LineService = require('../services/channelIntegration/lineService');
const MessengerService = require('../services/channelIntegration/messengerService');
const Channel = require('../models/Channel');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

exports.handleWebhook = async (req, res) => {
    try {
        const { channel } = req.params;
        const data = req.body;
        let result;

        switch (channel) {
            case 'viber':
                result = await ViberService.handleIncomingMessage(data);
                break;
            case 'telegram':
                result = await TelegramService.handleIncomingMessage(data);
                break;
            case 'line':
                result = await LineService.handleIncomingMessage(data);
                break;
            case 'messenger':
                result = await MessengerService.handleIncomingMessage(data);
                break;
            default:
                return res.status(400).json({ message: 'Unsupported channel' });
        }

        // Update conversation and analytics
        await updateConversationStats(channel, data);

        res.json(result);
    } catch (error) {
        console.error(`Error handling ${channel} webhook:`, error);
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};

async function updateConversationStats(channel, data) {
    try {
        const channelDoc = await Channel.findOne({ name: channel });
        if (!channelDoc) return;

        // Update or create conversation
        const conversation = await Conversation.findOneAndUpdate(
            {
                channelId: channelDoc._id,
                customerId: data.sender.id
            },
            {
                $inc: { messageCount: 1 },
                $set: {
                    lastMessage: {
                        content: data.message.text || 'Media content',
                        timestamp: new Date(),
                        type: data.message.type
                    }
                }
            },
            { upsert: true, new: true }
        );

        // Update channel analytics
        await Channel.findByIdAndUpdate(channelDoc._id, {
            $inc: {
                'analytics.totalMessages': 1,
                'analytics.totalConversations': conversation.messageCount === 1 ? 1 : 0
            }
        });
    } catch (error) {
        console.error('Error updating conversation stats:', error);
    }
}

exports.updateChannelSettings = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { autoReply, greetingMessage, workingHours, customCommands } = req.body;

        const channel = await Channel.findByIdAndUpdate(
            channelId,
            {
                $set: {
                    'autoReply.enabled': autoReply?.enabled,
                    'autoReply.language': autoReply?.language,
                    'autoReply.greetingMessage': greetingMessage,
                    workingHours,
                    customCommands
                }
            },
            { new: true }
        );

        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: 'Error updating channel settings', error: error.message });
    }
};

exports.getChannelAnalytics = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { startDate, endDate } = req.query;

        const analytics = await Conversation.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    messageCount: { $sum: "$messageCount" },
                    aiHandledCount: { $sum: { $cond: ["$metadata.aiHandled", 1, 0] } },
                    avgResponseTime: { $avg: "$metadata.responseTime" },
                    uniqueUsers: { $addToSet: "$customerId" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

exports.handleMediaMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { mediaType, mediaUrl, messageId } = req.body;

        // Process media message
        const processedMedia = await processMediaMessage(channelId, {
            type: mediaType,
            url: mediaUrl,
            messageId
        });

        res.json(processedMedia);
    } catch (error) {
        res.status(500).json({ message: 'Error handling media message', error: error.message });
    }
};

async function processMediaMessage(channelId, mediaInfo) {
    // Add media processing logic here
    // For example: image recognition, video processing, file handling
    return {
        processed: true,
        mediaInfo
    };
} 