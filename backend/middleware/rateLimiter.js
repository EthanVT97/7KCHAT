const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../services/cacheService').redis;

const createRateLimiter = (options = {}) => {
    return rateLimit({
        store: new RedisStore({
            client: redis,
            prefix: 'rate-limit:'
        }),
        windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
        max: options.max || 100, // Limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests, please try again later.'
        },
        ...options
    });
};

module.exports = {
    apiLimiter: createRateLimiter(),
    authLimiter: createRateLimiter({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5, // 5 attempts per hour
        message: {
            error: 'Too many login attempts, please try again later.'
        }
    }),
    webhookLimiter: createRateLimiter({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 60 // 60 requests per minute
    })
}; 