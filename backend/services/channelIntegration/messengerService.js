const fetch = require('node-fetch');
const aiService = require('../aiService');
const translationService = require('../translationService');

class MessengerService {
    constructor() {
        this.baseUrl = 'https://graph.facebook.com/v13.0';
    }

    async handleIncomingMessage(data) {
        try {
            const { message, sender } = data;
            
            // Detect language
            const language = await translationService.detectLanguage(message.text);
            
            // Generate AI response
            const response = await aiService.generateResponse(message.text);
            
            // Translate if needed
            const translatedResponse = language !== 'en' 
                ? await translationService.translateMessage(response, language)
                : response;

            // Send response
            await this.sendMessage(sender.id, translatedResponse);

            return {
                success: true,
                messageId: message.mid
            };
        } catch (error) {
            console.error('Error handling Messenger message:', error);
            throw error;
        }
    }

    async sendMessage(recipientId, message) {
        try {
            const response = await fetch(`${this.baseUrl}/me/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    recipient: { id: recipientId },
                    message: { text: message }
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending Messenger message:', error);
            throw error;
        }
    }
}

module.exports = new MessengerService(); 