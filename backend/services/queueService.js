const Bull = require('bull');
const config = require('../config/redis');

class QueueService {
    constructor() {
        this.queues = {
            messageProcessing: new Bull('message-processing', config.redis),
            analytics: new Bull('analytics', config.redis),
            notifications: new Bull('notifications', config.redis)
        };

        this.initializeQueues();
    }

    initializeQueues() {
        // Message processing queue
        this.queues.messageProcessing.process(async (job) => {
            try {
                const { message, channelId } = job.data;
                // Process message
                // Implementation needed
            } catch (error) {
                console.error('Message processing error:', error);
                throw error;
            }
        });

        // Analytics queue
        this.queues.analytics.process(async (job) => {
            try {
                const { type, data } = job.data;
                // Process analytics
                // Implementation needed
            } catch (error) {
                console.error('Analytics processing error:', error);
                throw error;
            }
        });
    }

    async addJob(queueName, data, options = {}) {
        try {
            const queue = this.queues[queueName];
            if (!queue) throw new Error(`Queue ${queueName} not found`);

            const job = await queue.add(data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                ...options
            });

            return job;
        } catch (error) {
            console.error('Error adding job to queue:', error);
            throw error;
        }
    }
}

module.exports = new QueueService(); 