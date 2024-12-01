const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    platformId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform',
        required: true
    },
    trigger: {
        type: {
            type: String,
            enum: ['keyword', 'time', 'event', 'sentiment'],
            required: true
        },
        conditions: [{
            field: String,
            operator: String,
            value: mongoose.Schema.Types.Mixed
        }]
    },
    actions: [{
        type: {
            type: String,
            enum: ['send_message', 'assign_staff', 'tag_conversation', 'escalate', 'api_call'],
            required: true
        },
        config: mongoose.Schema.Types.Mixed
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workflow', workflowSchema); 