const analyticsService = require('../services/analyticsService');
const advancedAnalyticsService = require('../services/advancedAnalyticsService');
const monitoringService = require('../services/monitoringService');

exports.getDashboardData = async (req, res) => {
    try {
        const dashboardData = await analyticsService.generateDashboardData();
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};

exports.getChannelMetrics = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { startDate, endDate } = req.query;

        const metrics = await analyticsService.getChannelMetrics(
            channelId,
            new Date(startDate),
            new Date(endDate)
        );

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channel metrics', error: error.message });
    }
};

exports.getCustomerEngagement = async (req, res) => {
    try {
        const { channelId } = req.params;
        const stats = await analyticsService.getCustomerEngagementStats(channelId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching engagement stats', error: error.message });
    }
};

exports.getChannelInsights = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { startDate, endDate } = req.query;

        const insights = await advancedAnalyticsService.generateChannelInsights(
            channelId,
            {
                start: new Date(startDate),
                end: new Date(endDate)
            }
        );

        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: 'Error generating insights', error: error.message });
    }
};

exports.getChannelHealth = async (req, res) => {
    try {
        const { channelId } = req.params;
        const health = await monitoringService.monitorChannelHealth(channelId);
        res.json(health);
    } catch (error) {
        res.status(500).json({ message: 'Error checking channel health', error: error.message });
    }
}; 