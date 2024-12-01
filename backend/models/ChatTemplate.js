const mongoose = require('mongoose');

const chatTemplateSchema = new mongoose.Schema({
    platformId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['welcome', 'support', 'gambling', 'payment', 'promotion'],
        required: true
    },
    content: {
        my: { type: String, required: true },
        en: { type: String, required: true }
    },
    variables: [{
        name: String,
        description: String
    }],
    tags: [String],
    shortcut: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatTemplate', chatTemplateSchema); 