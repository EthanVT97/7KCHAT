require('dotenv').config();

const config = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
    },
    // Add other configuration categories here
    // For example:
    // discord: {
    //     token: process.env.DISCORD_TOKEN,
    //     clientId: process.env.DISCORD_CLIENT_ID
    // }
};

module.exports = config; 