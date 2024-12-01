const fetch = require('node-fetch');
const aiService = require('../aiService');
const translationService = require('../translationService');

class TelegramService {
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN;
        this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    }

    async handleIncomingMessage(data) {
        try {
            const { message } = data;
            const chatId = message.chat.id;
            
            // Handle different message types
            if (message.text) {
                const language = await translationService.detectLanguage(message.text);
                const response = await aiService.generateResponse(message.text);
                const translatedResponse = language !== 'en' 
                    ? await translationService.translateMessage(response, language)
                    : response;

                await this.sendMessage(chatId, translatedResponse);
            } else if (message.photo || message.video || message.document) {
                await this.handleMediaMessage(message);
            }

            return { success: true };
        } catch (error) {
            console.error('Error handling Telegram message:', error);
            throw error;
        }
    }

    async sendMessage(chatId, text, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text,
                    parse_mode: 'HTML',
                    ...options
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending Telegram message:', error);
            throw error;
        }
    }

    async handleMediaMessage(message) {
        try {
            const chatId = message.chat.id;
            let fileId = '';
            let type = '';

            if (message.photo) {
                fileId = message.photo[message.photo.length - 1].file_id;
                type = 'photo';
            } else if (message.video) {
                fileId = message.video.file_id;
                type = 'video';
            } else if (message.document) {
                fileId = message.document.file_id;
                type = 'document';
            }

            const fileUrl = await this.getFileUrl(fileId);
            const response = await aiService.generateMediaResponse(type, fileUrl);
            await this.sendMessage(chatId, response);

            return { success: true };
        } catch (error) {
            console.error('Error handling Telegram media:', error);
            throw error;
        }
    }

    async getFileUrl(fileId) {
        const response = await fetch(`${this.baseUrl}/getFile?file_id=${fileId}`);
        const data = await response.json();
        return `https://api.telegram.org/file/bot${this.token}/${data.result.file_path}`;
    }
}

module.exports = new TelegramService(); 