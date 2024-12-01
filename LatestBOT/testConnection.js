const mongoose = require('mongoose');
const config = require('./config/config');

async function connectToMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        };

        // Using the URI from config
        console.log('Attempting connection...');
        await mongoose.connect(config.mongodb.uri, options);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Connection error details:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

connectToMongoDB();