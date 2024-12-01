const fetch = require('node-fetch');
const aiService = require('../aiService');
const translationService = require('../translationService');

class ViberService {
    constructor() {
        this.authToken = process.env.VIBER_AUTH_TOKEN;
        this.baseUrl = 'https://chatapi.viber.com/pa';
    }

    async handleIncomingMessage(data) {
        try {
            const { message, sender } = data;
            
            // Detect language
            const language = await translationService.detectLanguage(message.text);
            
            // Generate AI response based on Myanmar culture
            const response = await aiService.generateResponse(message.text);
            
            // Translate if needed
            const translatedResponse = language !== 'en' 
                ? await translationService.translateMessage(response, language)
                : response;

            // Send response
            await this.sendMessage(sender.id, {
                type: 'text',
                text: translatedResponse
            });

            return {
                success: true,
                messageId: message.message_token
            };
        } catch (error) {
            console.error('Error handling Viber message:', error);
            throw error;
        }
    }

    async sendMessage(userId, message) {
        try {
            const response = await fetch(`${this.baseUrl}/send_message`, {
                method: 'POST',
                headers: {
                    'X-Viber-Auth-Token': this.authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    receiver: userId,
                    type: message.type,
                    text: message.text,
                    min_api_version: 1
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending Viber message:', error);
            throw error;
        }
    }

    async handleMediaMessage(data) {
        try {
            const { message, sender, type } = data;
            let mediaUrl = '';

            switch (type) {
                case 'picture':
                    mediaUrl = message.media;
                    break;
                case 'video':
                    mediaUrl = message.media;
                    break;
                case 'file':
                    mediaUrl = message.media;
                    break;
            }

            // Store media URL and generate response
            const response = await aiService.generateMediaResponse(type, mediaUrl);
            await this.sendMessage(sender.id, { type: 'text', text: response });

            return { success: true };
        } catch (error) {
            console.error('Error handling Viber media:', error);
            throw error;
        }
    }
}

module.exports = new ViberService(); 