const Redis = require('ioredis');
const config = require('../config/redis');

class CacheService {
    constructor() {
        this.redis = new Redis(config.redis);
        this.defaultTTL = 3600; // 1 hour
    }

    async get(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set(key, value, ttl = this.defaultTTL) {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    }

    async invalidate(pattern) {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }
}

module.exports = new CacheService(); 