const Conversation = require('../models/Conversation');
const Channel = require('../models/Channel');

class AnalyticsService {
    async getChannelMetrics(channelId, startDate, endDate) {
        try {
            const metrics = await Conversation.aggregate([
                {
                    $match: {
                        channelId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        totalConversations: { $sum: 1 },
                        totalMessages: { $sum: "$messageCount" },
                        aiHandled: { $sum: { $cond: ["$metadata.aiHandled", 1, 0] } }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            return metrics;
        } catch (error) {
            console.error('Error getting channel metrics:', error);
            throw error;
        }
    }

    async getCustomerEngagementStats(channelId) {
        try {
            const stats = await Conversation.aggregate([
                {
                    $match: { channelId }
                },
                {
                    $group: {
                        _id: "$customerInfo.language",
                        totalCustomers: { $addToSet: "$customerId" },
                        avgMessagesPerCustomer: { $avg: "$messageCount" }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            console.error('Error getting engagement stats:', error);
            throw error;
        }
    }

    async generateDashboardData() {
        try {
            const now = new Date();
            const lastWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);

            const channelStats = await Channel.aggregate([
                {
                    $lookup: {
                        from: 'conversations',
                        localField: '_id',
                        foreignField: 'channelId',
                        as: 'conversations'
                    }
                },
                {
                    $project: {
                        name: 1,
                        type: 1,
                        totalConversations: { $size: '$conversations' },
                        activeConversations: {
                            $size: {
                                $filter: {
                                    input: '$conversations',
                                    as: 'conv',
                                    cond: { $eq: ['$$conv.status', 'active'] }
                                }
                            }
                        }
                    }
                }
            ]);

            return {
                channelStats,
                timeRange: {
                    start: lastWeek,
                    end: now
                }
            };
        } catch (error) {
            console.error('Error generating dashboard data:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsService(); 