const socketIO = require('../config/socket');
const queueService = require('./queueService');
const Channel = require('../models/Channel');

class NotificationService {
    constructor() {
        this.io = socketIO;
        this.notificationTypes = {
            CHAT_MESSAGE: 'chat_message',
            SYSTEM_ALERT: 'system_alert',
            USER_ACTION: 'user_action'
        };
    }

    async sendNotification(type, data, recipients) {
        try {
            // Queue notification for processing
            await queueService.addJob('notifications', {
                type,
                data,
                recipients
            });

            // Send real-time notification via Socket.IO
            recipients.forEach(recipientId => {
                this.io.to(`user:${recipientId}`).emit('notification', {
                    type,
                    data,
                    timestamp: new Date()
                });
            });

            // Store notification in database
            await this.storeNotification(type, data, recipients);
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    async sendChannelAlert(channelId, alert) {
        try {
            const channel = await Channel.findById(channelId)
                .populate('settings.notifications');

            if (channel.settings.notifications.email) {
                await this.sendEmailAlert(channel, alert);
            }

            if (channel.settings.notifications.slack) {
                await this.sendSlackAlert(channel, alert);
            }

            // Send to all channel admins
            this.io.to(`channel:${channelId}:admins`).emit('channel_alert', {
                channelId,
                alert,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error sending channel alert:', error);
            throw error;
        }
    }

    async storeNotification(type, data, recipients) {
        // Implementation for storing notifications in database
    }

    async sendEmailAlert(channel, alert) {
        // Implementation for sending email alerts
    }

    async sendSlackAlert(channel, alert) {
        // Implementation for sending Slack alerts
    }
}

module.exports = new NotificationService(); 