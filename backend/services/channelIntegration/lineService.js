const fetch = require('node-fetch');
const aiService = require('../aiService');
const translationService = require('../translationService');

class LineService {
    constructor() {
        this.channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        this.baseUrl = 'https://api.line.me/v2/bot';
    }

    async handleIncomingMessage(data) {
        try {
            const { events } = data;
            
            for (const event of events) {
                if (event.type === 'message') {
                    await this.processMessage(event);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error handling Line message:', error);
            throw error;
        }
    }

    async processMessage(event) {
        const { message, replyToken } = event;

        switch (message.type) {
            case 'text':
                const language = await translationService.detectLanguage(message.text);
                const response = await aiService.generateResponse(message.text);
                const translatedResponse = language !== 'en' 
                    ? await translationService.translateMessage(response, language)
                    : response;
                
                await this.replyMessage(replyToken, [{
                    type: 'text',
                    text: translatedResponse
                }]);
                break;

            case 'image':
            case 'video':
            case 'file':
                const mediaUrl = await this.getMessageContent(message.id);
                const mediaResponse = await aiService.generateMediaResponse(message.type, mediaUrl);
                await this.replyMessage(replyToken, [{
                    type: 'text',
                    text: mediaResponse
                }]);
                break;
        }
    }

    async replyMessage(replyToken, messages) {
        try {
            const response = await fetch(`${this.baseUrl}/message/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.channelAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    replyToken,
                    messages
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error replying to Line message:', error);
            throw error;
        }
    }

    async getMessageContent(messageId) {
        try {
            const response = await fetch(`${this.baseUrl}/message/${messageId}/content`, {
                headers: {
                    'Authorization': `Bearer ${this.channelAccessToken}`
                }
            });
            return await response.buffer();
        } catch (error) {
            console.error('Error getting Line message content:', error);
            throw error;
        }
    }
}

module.exports = new LineService(); 