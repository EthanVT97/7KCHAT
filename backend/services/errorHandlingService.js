const winston = require('winston');
const Sentry = require('@sentry/node');

class ErrorHandlingService {
    constructor() {
        this.logger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.File({ filename: 'error.log' }),
                new winston.transports.Console({
                    format: winston.format.simple()
                })
            ]
        });

        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV
        });
    }

    handleError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date()
        };

        // Log to file
        this.logger.error(errorInfo);

        // Send to Sentry
        Sentry.captureException(error, {
            extra: context
        });

        // Return error response format
        return {
            error: true,
            message: error.message,
            code: error.code || 'INTERNAL_ERROR',
            timestamp: errorInfo.timestamp
        };
    }

    async logMetric(metric) {
        try {
            await this.logger.info('metric', {
                ...metric,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error logging metric:', error);
        }
    }
}

module.exports = new ErrorHandlingService(); 