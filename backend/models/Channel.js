const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Facebook', 'Viber', 'Line', 'Telegram', 'TheLordMM', 'TJ89', '9Plus'],
        index: true
    },
    type: {
        type: String,
        enum: ['social', 'gambling', 'messaging'],
        required: true,
        index: true
    },
    config: {
        accessToken: {
            type: String,
            required: true,
            select: false // Hide sensitive data by default
        },
        pageId: String,
        webhookSecret: {
            type: String,
            select: false
        },
        botToken: {
            type: String,
            select: false
        },
        verifyToken: {
            type: String,
            select: false
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'error', 'maintenance'],
        default: 'active',
        index: true
    },
    settings: {
        autoReply: {
            enabled: { type: Boolean, default: true },
            language: { type: String, default: 'my' },
            workingHours: {
                enabled: { type: Boolean, default: false },
                schedule: [{
                    day: { type: Number, min: 0, max: 6 },
                    start: String,
                    end: String
                }]
            },
            templates: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MessageTemplate'
            }]
        },
        notifications: {
            email: { type: Boolean, default: true },
            slack: { type: Boolean, default: false },
            telegram: { type: Boolean, default: false }
        }
    },
    metrics: {
        responseTime: {
            avg: { type: Number, default: 0 },
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 }
        },
        messageVolume: {
            daily: { type: Number, default: 0 },
            weekly: { type: Number, default: 0 },
            monthly: { type: Number, default: 0 }
        },
        satisfaction: {
            score: { type: Number, min: 0, max: 5, default: 0 },
            totalRatings: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true
});

// Indexes
channelSchema.index({ createdAt: 1 });
channelSchema.index({ 'metrics.messageVolume.daily': -1 });
channelSchema.index({ 'metrics.satisfaction.score': -1 });

// Middleware
channelSchema.pre('save', async function(next) {
    if (this.isModified('config')) {
        // Encrypt sensitive data before saving
        // Implementation needed
    }
    next();
});

// Methods
channelSchema.methods.isOperational = function() {
    return this.status === 'active' && this.validateWorkingHours();
};

channelSchema.methods.validateWorkingHours = function() {
    if (!this.settings.autoReply.workingHours.enabled) return true;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const schedule = this.settings.autoReply.workingHours.schedule.find(
        s => s.day === currentDay
    );

    if (!schedule) return false;
    return currentTime >= schedule.start && currentTime <= schedule.end;
};

module.exports = mongoose.model('Channel', channelSchema); 