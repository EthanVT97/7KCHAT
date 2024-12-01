const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    channelType: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    customerInfo: {
        name: String,
        profilePic: String,
        language: String
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'pending', 'blocked'],
        default: 'active'
    },
    lastMessage: {
        content: String,
        timestamp: Date,
        type: String
    },
    metadata: {
        platform: String,
        tags: [String],
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        aiHandled: { type: Boolean, default: false }
    },
    messageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema); 