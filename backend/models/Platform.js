const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['gambling', 'social', 'marketplace'],
        required: true
    },
    apiConfig: {
        apiKey: String,
        apiSecret: String,
        webhookUrl: String,
        baseUrl: String
    },
    settings: {
        autoReply: {
            enabled: { type: Boolean, default: true },
            templates: [{
                trigger: String,
                response: String,
                language: { type: String, default: 'en' }
            }]
        },
        translation: {
            enabled: { type: Boolean, default: true },
            defaultLanguage: { type: String, default: 'en' }
        },
        moderationRules: [{
            type: { type: String, enum: ['spam', 'offensive', 'gambling'] },
            action: { type: String, enum: ['block', 'flag', 'delete'] },
            enabled: { type: Boolean, default: true }
        }]
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Platform', platformSchema); 