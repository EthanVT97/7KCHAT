const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['greeting', 'support', 'gambling', 'payment', 'promotion', 'error'],
        required: true
    },
    content: {
        my: {
            text: String,
            attachments: [{
                type: String,
                url: String
            }]
        },
        en: {
            text: String,
            attachments: [{
                type: String,
                url: String
            }]
        }
    },
    triggers: [{
        type: String,
        keywords: [String],
        conditions: {
            timeRange: {
                start: String,
                end: String
            },
            userType: [String],
            platform: [String]
        }
    }],
    metadata: {
        usageCount: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        lastModified: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema); 