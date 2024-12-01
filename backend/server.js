require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config/deployment');

const app = express();

// Security middleware
app.use(helmet(config.security.helmet));
app.use(cors({ origin: config.corsOrigins }));
app.use(rateLimit(config.security.rateLimit));
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying database connection... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error('MongoDB connection failed:', err);
            process.exit(1);
        }
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/users', require('./routes/user'));
app.use('/api/gambling', require('./routes/gambling'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/webhook', require('./routes/webhook'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: config.environment === 'production' 
            ? 'Internal Server Error' 
            : err.message
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: config.environment });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.environment} mode`);
}); 