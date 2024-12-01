const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    platform: {
        type: String,
        enum: ['TheLordMM', 'TJ89', '9Plus', 'internal'],
        required: true
    },
    type: {
        type: String,
        enum: ['direct', 'group', 'support'],
        default: 'direct'
    },
    metadata: {
        language: {
            type: String,
            default: 'my'
        },
        lastActivity: Date,
        messageCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    settings: {
        notifications: {
            type: Boolean,
            default: true
        },
        autoTranslate: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema); 