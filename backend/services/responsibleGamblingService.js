const BettingLimit = require('../models/BettingLimit');
const User = require('../models/User');
const aiService = require('./aiService');

class ResponsibleGamblingService {
    async checkBettingLimit(userId, platform, amount) {
        try {
            const limit = await BettingLimit.findOne({ userId, platform });
            if (!limit) return { allowed: true };

            const now = new Date();
            await this._resetLimitsIfNeeded(limit, now);

            // Check if user is in cooldown period
            if (limit.cooldownPeriod.active && now < limit.cooldownPeriod.endDate) {
                return {
                    allowed: false,
                    reason: 'User is in cooldown period',
                    endDate: limit.cooldownPeriod.endDate
                };
            }

            // Check daily limit
            if (limit.currentUsage.daily + amount > limit.dailyLimit.amount) {
                return {
                    allowed: false,
                    reason: 'Daily limit exceeded',
                    remaining: limit.dailyLimit.amount - limit.currentUsage.daily
                };
            }

            // Check weekly limit
            if (limit.currentUsage.weekly + amount > limit.weeklyLimit.amount) {
                return {
                    allowed: false,
                    reason: 'Weekly limit exceeded',
                    remaining: limit.weeklyLimit.amount - limit.currentUsage.weekly
                };
            }

            // Check monthly limit
            if (limit.currentUsage.monthly + amount > limit.monthlyLimit.amount) {
                return {
                    allowed: false,
                    reason: 'Monthly limit exceeded',
                    remaining: limit.monthlyLimit.amount - limit.currentUsage.monthly
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Error checking betting limit:', error);
            throw error;
        }
    }

    async _resetLimitsIfNeeded(limit, currentDate) {
        const updates = {};
        
        // Reset daily usage if needed
        if (this._shouldResetDaily(limit.currentUsage.lastReset.daily, currentDate)) {
            updates['currentUsage.daily'] = 0;
            updates['currentUsage.lastReset.daily'] = currentDate;
        }

        // Reset weekly usage if needed
        if (this._shouldResetWeekly(limit.currentUsage.lastReset.weekly, currentDate)) {
            updates['currentUsage.weekly'] = 0;
            updates['currentUsage.lastReset.weekly'] = currentDate;
        }

        // Reset monthly usage if needed
        if (this._shouldResetMonthly(limit.currentUsage.lastReset.monthly, currentDate)) {
            updates['currentUsage.monthly'] = 0;
            updates['currentUsage.lastReset.monthly'] = currentDate;
        }

        if (Object.keys(updates).length > 0) {
            await BettingLimit.findByIdAndUpdate(limit._id, { $set: updates });
        }
    }

    async analyzeBehavior(userId) {
        try {
            const user = await User.findById(userId);
            const bettingHistory = await this._getBettingHistory(userId);
            
            const analysis = await aiService.analyzeGamblingBehavior(bettingHistory);
            
            if (analysis.riskLevel === 'high') {
                await this._triggerResponsibleGamblingActions(userId, analysis);
            }

            return analysis;
        } catch (error) {
            console.error('Error analyzing behavior:', error);
            throw error;
        }
    }

    async setCooldownPeriod(userId, platform, days) {
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + days);

            await BettingLimit.findOneAndUpdate(
                { userId, platform },
                {
                    'cooldownPeriod.active': true,
                    'cooldownPeriod.startDate': startDate,
                    'cooldownPeriod.endDate': endDate
                },
                { upsert: true }
            );

            return { startDate, endDate };
        } catch (error) {
            console.error('Error setting cooldown period:', error);
            throw error;
        }
    }

    _shouldResetDaily(lastReset, currentDate) {
        return !lastReset || lastReset.getDate() !== currentDate.getDate();
    }

    _shouldResetWeekly(lastReset, currentDate) {
        if (!lastReset) return true;
        const diffTime = Math.abs(currentDate - lastReset);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
    }

    _shouldResetMonthly(lastReset, currentDate) {
        return !lastReset || lastReset.getMonth() !== currentDate.getMonth();
    }
}

module.exports = new ResponsibleGamblingService(); 