const Channel = require('../models/Channel');
const fetch = require('node-fetch');

exports.setupChannel = async (req, res) => {
    try {
        const { name, type, config } = req.body;

        // Validate channel configuration
        await validateChannelConfig(name, config);

        const channel = await Channel.create({
            name,
            type,
            config,
            autoReply: {
                enabled: true,
                language: 'my',
                greetingMessage: {
                    my: 'မင်္ဂလာပါ။ SEVEN7K Chat မှ ကြိုဆိုပါတယ်။',
                    en: 'Welcome to SEVEN7K Chat.'
                }
            }
        });

        // Set up webhook for the channel
        await setupChannelWebhook(name, config);

        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: 'Error setting up channel', error: error.message });
    }
};

async function validateChannelConfig(name, config) {
    switch (name) {
        case 'messenger':
            await validateMessengerToken(config.accessToken);
            break;
        case 'viber':
            await validateViberToken(config.authToken);
            break;
        case 'telegram':
            await validateTelegramToken(config.botToken);
            break;
        case 'line':
            await validateLineToken(config.channelAccessToken);
            break;
    }
}

async function setupChannelWebhook(name, config) {
    const baseUrl = process.env.BASE_URL;
    
    switch (name) {
        case 'messenger':
            await fetch(`https://graph.facebook.com/v13.0/me/subscribed_apps`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.accessToken}`
                }
            });
            break;

        case 'viber':
            await fetch('https://chatapi.viber.com/pa/set_webhook', {
                method: 'POST',
                headers: {
                    'X-Viber-Auth-Token': config.authToken
                },
                body: JSON.stringify({
                    url: `${baseUrl}/webhook/viber`,
                    event_types: ['message', 'subscribed', 'unsubscribed']
                })
            });
            break;

        case 'telegram':
            await fetch(`https://api.telegram.org/bot${config.botToken}/setWebhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: `${baseUrl}/webhook/telegram/${process.env.TELEGRAM_SECRET_PATH}`
                })
            });
            break;

        case 'line':
            // LINE webhook needs to be set up manually in LINE Developer Console
            break;
    }
}

exports.getChannelStatus = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);
        
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const status = await checkChannelStatus(channel);
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error checking channel status', error: error.message });
    }
};

async function checkChannelStatus(channel) {
    try {
        switch (channel.name) {
            case 'messenger':
                const messengerResponse = await fetch(`https://graph.facebook.com/v13.0/me?access_token=${channel.config.accessToken}`);
                return { status: messengerResponse.ok ? 'active' : 'error' };

            case 'viber':
                const viberResponse = await fetch('https://chatapi.viber.com/pa/get_account_info', {
                    method: 'POST',
                    headers: { 'X-Viber-Auth-Token': channel.config.authToken }
                });
                return { status: viberResponse.ok ? 'active' : 'error' };

            case 'telegram':
                const telegramResponse = await fetch(`https://api.telegram.org/bot${channel.config.botToken}/getMe`);
                return { status: telegramResponse.ok ? 'active' : 'error' };

            case 'line':
                const lineResponse = await fetch('https://api.line.me/v2/bot/info', {
                    headers: { 'Authorization': `Bearer ${channel.config.channelAccessToken}` }
                });
                return { status: lineResponse.ok ? 'active' : 'error' };

            default:
                return { status: 'unknown' };
        }
    } catch (error) {
        return { status: 'error', error: error.message };
    }
} 