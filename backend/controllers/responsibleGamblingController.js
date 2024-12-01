const ResponsibleGamblingService = require('../services/responsibleGamblingService');
const BettingLimit = require('../models/BettingLimit');

exports.setBettingLimits = async (req, res) => {
    try {
        const { platform, dailyLimit, weeklyLimit, monthlyLimit } = req.body;
        const userId = req.user._id;

        const bettingLimit = await BettingLimit.findOneAndUpdate(
            { userId, platform },
            {
                dailyLimit,
                weeklyLimit,
                monthlyLimit,
                'currentUsage.lastReset': {
                    daily: new Date(),
                    weekly: new Date(),
                    monthly: new Date()
                }
            },
            { upsert: true, new: true }
        );

        res.json(bettingLimit);
    } catch (error) {
        res.status(500).json({ message: 'Error setting betting limits', error: error.message });
    }
};

exports.getBettingLimits = async (req, res) => {
    try {
        const { platform } = req.params;
        const userId = req.user._id;

        const limits = await BettingLimit.findOne({ userId, platform });
        res.json(limits || { message: 'No betting limits set' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching betting limits', error: error.message });
    }
};

exports.setCooldownPeriod = async (req, res) => {
    try {
        const { platform, days } = req.body;
        const userId = req.user._id;

        const cooldown = await ResponsibleGamblingService.setCooldownPeriod(
            userId,
            platform,
            days
        );

        res.json(cooldown);
    } catch (error) {
        res.status(500).json({ message: 'Error setting cooldown period', error: error.message });
    }
};

exports.getGamblingBehaviorAnalysis = async (req, res) => {
    try {
        const userId = req.user._id;
        const analysis = await ResponsibleGamblingService.analyzeBehavior(userId);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing gambling behavior', error: error.message });
    }
}; 