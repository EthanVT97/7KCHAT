const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    language: {
        type: String,
        default: 'my'
    },
    metadata: {
        platform: String,
        translated: Boolean,
        originalContent: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema); 