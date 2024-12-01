const Channel = require('../models/Channel');
const Conversation = require('../models/Conversation');
const socketIO = require('../config/socket');

class MonitoringService {
    constructor() {
        this.alertThresholds = {
            responseTime: 300, // 5 minutes
            errorRate: 0.1, // 10%
            queueLength: 50
        };
        this.metrics = new Map();
    }

    async monitorChannelHealth(channelId) {
        try {
            const metrics = await this._collectChannelMetrics(channelId);
            const health = this._analyzeChannelHealth(metrics);
            
            if (health.alerts.length > 0) {
                await this._triggerAlerts(channelId, health.alerts);
            }

            // Emit real-time metrics through Socket.IO
            socketIO.emit('channel:metrics', {
                channelId,
                metrics: health
            });

            return health;
        } catch (error) {
            console.error('Error monitoring channel health:', error);
            throw error;
        }
    }

    async _collectChannelMetrics(channelId) {
        const now = new Date();
        const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

        const metrics = await Conversation.aggregate([
            {
                $match: {
                    channelId: mongoose.Types.ObjectId(channelId),
                    updatedAt: { $gte: fiveMinutesAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    activeChats: { $sum: 1 },
                    avgResponseTime: { $avg: '$metadata.responseTime' },
                    errorCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'error'] }, 1, 0]
                        }
                    },
                    aiHandledCount: {
                        $sum: {
                            $cond: ['$metadata.aiHandled', 1, 0]
                        }
                    }
                }
            }
        ]);

        return metrics[0] || {
            activeChats: 0,
            avgResponseTime: 0,
            errorCount: 0,
            aiHandledCount: 0
        };
    }

    _analyzeChannelHealth(metrics) {
        const alerts = [];

        if (metrics.avgResponseTime > this.alertThresholds.responseTime) {
            alerts.push({
                type: 'high_response_time',
                severity: 'warning',
                message: 'Average response time exceeding threshold'
            });
        }

        if (metrics.activeChats > this.alertThresholds.queueLength) {
            alerts.push({
                type: 'high_queue_length',
                severity: 'critical',
                message: 'Too many active conversations'
            });
        }

        const errorRate = metrics.errorCount / metrics.activeChats;
        if (errorRate > this.alertThresholds.errorRate) {
            alerts.push({
                type: 'high_error_rate',
                severity: 'critical',
                message: 'High error rate detected'
            });
        }

        return {
            status: alerts.length === 0 ? 'healthy' : 'warning',
            metrics,
            alerts
        };
    }

    async _triggerAlerts(channelId, alerts) {
        // Emit alerts through Socket.IO
        socketIO.emit('channel:alerts', {
            channelId,
            alerts
        });

        // Store alerts in database
        await Channel.findByIdAndUpdate(channelId, {
            $push: {
                'alerts': {
                    $each: alerts,
                    $position: 0,
                    $slice: 100 // Keep last 100 alerts
                }
            }
        });
    }
}

module.exports = new MonitoringService(); 