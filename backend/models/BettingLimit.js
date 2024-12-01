const mongoose = require('mongoose');

const bettingLimitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['TheLordMM', 'TJ89', '9Plus'],
        required: true
    },
    dailyLimit: {
        amount: Number,
        currency: { type: String, default: 'MMK' }
    },
    weeklyLimit: {
        amount: Number,
        currency: { type: String, default: 'MMK' }
    },
    monthlyLimit: {
        amount: Number,
        currency: { type: String, default: 'MMK' }
    },
    currentUsage: {
        daily: Number,
        weekly: Number,
        monthly: Number,
        lastReset: {
            daily: Date,
            weekly: Date,
            monthly: Date
        }
    },
    cooldownPeriod: {
        active: { type: Boolean, default: false },
        startDate: Date,
        endDate: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BettingLimit', bettingLimitSchema); 