require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    openaiApiKey: process.env.OPENAI_API_KEY,
    corsOrigins: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    logLevel: process.env.LOG_LEVEL || 'info',
    rateLimiting: {
        windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
        max: process.env.RATE_LIMIT_MAX || 100 // limit each IP to 100 requests per windowMs
    },
    socketOptions: {
        pingTimeout: 60000,
        pingInterval: 25000
    }
}; 