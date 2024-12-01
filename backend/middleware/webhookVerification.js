const crypto = require('crypto');

exports.verifyMessenger = (req, res, next) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return res.status(401).json({ error: 'No signature provided' });
    }

    const signatureHash = signature.split('=')[1];
    const expectedHash = crypto
        .createHmac('sha256', process.env.MESSENGER_APP_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signatureHash !== expectedHash) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
};

exports.verifyViber = (req, res, next) => {
    const signature = req.headers['x-viber-content-signature'];
    if (!signature) {
        return res.status(401).json({ error: 'No signature provided' });
    }

    const expectedHash = crypto
        .createHmac('sha256', process.env.VIBER_AUTH_TOKEN)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedHash) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
};

exports.verifyTelegram = (req, res, next) => {
    // Telegram doesn't provide webhook signatures, but we can verify the token in the URL
    const secretPath = process.env.TELEGRAM_SECRET_PATH;
    if (!req.path.includes(secretPath)) {
        return res.status(401).json({ error: 'Invalid webhook path' });
    }
    next();
};

exports.verifyLine = (req, res, next) => {
    const signature = req.headers['x-line-signature'];
    if (!signature) {
        return res.status(401).json({ error: 'No signature provided' });
    }

    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    const body = JSON.stringify(req.body);
    const expectedHash = crypto
        .createHmac('sha256', channelSecret)
        .update(body)
        .digest('base64');

    if (signature !== expectedHash) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
}; 