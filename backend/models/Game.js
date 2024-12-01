const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['TheLordMM', 'TJ89', '9Plus'],
        required: true
    },
    type: {
        type: String,
        enum: ['2D', '3D', 'football', 'casino'],
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'ended', 'cancelled'],
        default: 'upcoming'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: Date,
    odds: {
        type: Map,
        of: Number,
        required: true
    },
    limits: {
        minBet: {
            type: Number,
            required: true
        },
        maxBet: {
            type: Number,
            required: true
        }
    },
    results: {
        outcome: String,
        details: mongoose.Schema.Types.Mixed,
        publishedAt: Date
    },
    metadata: {
        totalBets: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        participants: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Indexes for quick lookups
gameSchema.index({ platform: 1, status: 1 });
gameSchema.index({ startTime: 1, status: 1 });
gameSchema.index({ type: 1, platform: 1 });

module.exports = mongoose.model('Game', gameSchema); 