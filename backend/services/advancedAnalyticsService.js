const Conversation = require('../models/Conversation');
const Channel = require('../models/Channel');
const MessageTemplate = require('../models/MessageTemplate');
const mongoose = require('mongoose');

class AdvancedAnalyticsService {
    async generateChannelInsights(channelId, timeRange) {
        try {
            const [
                conversationMetrics,
                userBehavior,
                templatePerformance,
                peakHours
            ] = await Promise.all([
                this._analyzeConversations(channelId, timeRange),
                this._analyzeUserBehavior(channelId, timeRange),
                this._analyzeTemplatePerformance(channelId, timeRange),
                this._analyzePeakHours(channelId, timeRange)
            ]);

            return {
                conversationMetrics,
                userBehavior,
                templatePerformance,
                peakHours,
                generatedAt: new Date()
            };
        } catch (error) {
            console.error('Error generating channel insights:', error);
            throw error;
        }
    }

    async _analyzeConversations(channelId, timeRange) {
        const metrics = await Conversation.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    createdAt: {
                        $gte: timeRange.start,
                        $lte: timeRange.end
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalConversations: { $sum: 1 },
                    avgDuration: { $avg: '$metadata.duration' },
                    avgMessageCount: { $avg: '$messageCount' },
                    resolutionRate: {
                        $avg: {
                            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
                        }
                    },
                    aiHandlingRate: {
                        $avg: {
                            $cond: ['$metadata.aiHandled', 1, 0]
                        }
                    }
                }
            }
        ]);

        return metrics[0];
    }

    async _analyzeUserBehavior(channelId, timeRange) {
        return await Conversation.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    createdAt: {
                        $gte: timeRange.start,
                        $lte: timeRange.end
                    }
                }
            },
            {
                $group: {
                    _id: '$customerId',
                    conversationCount: { $sum: 1 },
                    totalMessages: { $sum: '$messageCount' },
                    avgResponseTime: { $avg: '$metadata.responseTime' },
                    preferredLanguage: { $first: '$customerInfo.language' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    avgConversationsPerUser: { $avg: '$conversationCount' },
                    avgMessagesPerUser: { $avg: '$totalMessages' },
                    languageDistribution: {
                        $push: {
                            language: '$preferredLanguage',
                            count: 1
                        }
                    }
                }
            }
        ]);
    }

    async _analyzeTemplatePerformance(channelId, timeRange) {
        // Analyze template usage and effectiveness
        const templateStats = await MessageTemplate.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    'metadata.lastModified': {
                        $gte: timeRange.start,
                        $lte: timeRange.end
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalUsage: { $sum: '$metadata.usageCount' },
                    avgSuccessRate: { $avg: '$metadata.successRate' },
                    templates: { $push: '$$ROOT' }
                }
            }
        ]);

        return templateStats;
    }

    async _analyzePeakHours(channelId, timeRange) {
        return await Conversation.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    createdAt: {
                        $gte: timeRange.start,
                        $lte: timeRange.end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: '$createdAt' },
                        dayOfWeek: { $dayOfWeek: '$createdAt' }
                    },
                    conversationCount: { $sum: 1 },
                    avgResponseTime: { $avg: '$metadata.responseTime' }
                }
            },
            {
                $sort: { conversationCount: -1 }
            }
        ]);
    }
}

module.exports = new AdvancedAnalyticsService(); 