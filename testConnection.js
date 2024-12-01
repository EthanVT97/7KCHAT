require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        const uri = process.env.MONGODB_URI;
        console.log('Connection URI:', uri.replace(/\/\/(.*?)@/, '//****:****@'));

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            authSource: 'admin',
            dbName: 'myVirtualDatabase',
            retryWrites: true,
            w: 'majority',
            auth: {
                username: 'user1',
                password: 'user1'
            }
        };

        console.log('Connecting with options:', JSON.stringify({
            ...options,
            auth: '****'  // Hide credentials in logs
        }, null, 2));

        await mongoose.connect(uri, options);
        console.log('Successfully connected to MongoDB');

        // Test the connection
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('Connection failed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            details: error.errInfo
        });

        if (error.name === 'MongoServerSelectionError') {
            console.error('Server selection failed. Please check:');
            console.error('1. Network connectivity');
            console.error('2. MongoDB Atlas whitelist settings');
            console.error('3. Database user credentials');
        }
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('Connection closed');
        }
    }
}

mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'));
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', {
    name: err.name,
    message: err.message,
    code: err.code
}));

connectToMongoDB(); 