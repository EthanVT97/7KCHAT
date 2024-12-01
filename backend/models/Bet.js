const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    platform: {
        type: String,
        enum: ['TheLordMM', 'TJ89', '9Plus'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    odds: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'cancelled'],
        default: 'pending'
    },
    result: {
        outcome: String,
        winAmount: Number,
        settledAt: Date
    },
    metadata: {
        ip: String,
        device: String,
        location: String
    }
}, {
    timestamps: true
});

// Add index for quick lookups
betSchema.index({ user: 1, status: 1 });
betSchema.index({ game: 1, status: 1 });
betSchema.index({ platform: 1, createdAt: -1 });

module.exports = mongoose.model('Bet', betSchema); 