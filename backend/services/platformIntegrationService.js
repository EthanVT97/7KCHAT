const Platform = require('../models/Platform');
const aiService = require('./aiService');
const translationService = require('./translationService');

class PlatformIntegrationService {
    async handleIncomingMessage(platform, message) {
        try {
            // Detect language
            const language = await translationService.detectLanguage(message.content);
            
            // Moderate content
            const moderation = await aiService.moderateContent(message.content);
            
            if (moderation.flagged) {
                const rule = platform.settings.moderationRules.find(r => 
                    moderation.categories[r.type] && r.enabled
                );
                
                if (rule) {
                    return this._handleModeratedContent(rule, message);
                }
            }

            // Generate response if auto-reply is enabled
            if (platform.settings.autoReply.enabled) {
                const response = await aiService.generatePlatformSpecificResponse(
                    message.content,
                    platform
                );

                // Translate response if needed
                if (language !== platform.settings.translation.defaultLanguage) {
                    const translated = await translationService.translateMessage(
                        response,
                        language
                    );
                    return translated[language];
                }

                return response;
            }

            return null;
        } catch (error) {
            console.error('Platform integration error:', error);
            return null;
        }
    }

    async _handleModeratedContent(rule, message) {
        switch (rule.action) {
            case 'block':
                return 'This message was blocked due to content violations.';
            case 'flag':
                // Implement flagging logic
                return message;
            case 'delete':
                // Implement deletion logic
                return null;
            default:
                return message;
        }
    }
}

module.exports = new PlatformIntegrationService(); 