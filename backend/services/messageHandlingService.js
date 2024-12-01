const MessageTemplate = require('../models/MessageTemplate');
const aiService = require('./aiService');
const translationService = require('./translationService');

class MessageHandlingService {
    async processIncomingMessage(message, channel) {
        try {
            // Detect language and intent
            const language = await translationService.detectLanguage(message.text);
            const intent = await this._analyzeIntent(message.text);

            // Find appropriate template or generate AI response
            let response;
            if (intent.confidence > 0.8) {
                response = await this._getTemplateResponse(intent.category, channel.id, language);
            }

            if (!response) {
                response = await this._generateAIResponse(message, language, channel);
            }

            // Process any special commands or triggers
            const processedResponse = await this._processSpecialCommands(response, message);

            // Update analytics
            await this._updateMessageStats(channel.id, intent);

            return processedResponse;
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

    async _analyzeIntent(text) {
        try {
            const analysis = await aiService.analyzeIntent(text);
            return {
                category: analysis.category,
                confidence: analysis.confidence,
                entities: analysis.entities
            };
        } catch (error) {
            console.error('Error analyzing intent:', error);
            return { category: 'unknown', confidence: 0 };
        }
    }

    async _getTemplateResponse(category, channelId, language) {
        try {
            const template = await MessageTemplate.findOne({
                channelId,
                category,
                [`content.${language}`]: { $exists: true }
            });

            if (template) {
                await MessageTemplate.updateOne(
                    { _id: template._id },
                    { $inc: { 'metadata.usageCount': 1 } }
                );
                return template.content[language];
            }
            return null;
        } catch (error) {
            console.error('Error getting template:', error);
            return null;
        }
    }

    async _generateAIResponse(message, language, channel) {
        const culturalContext = {
            country: 'Myanmar',
            language,
            platform: channel.name,
            type: channel.type
        };

        const response = await aiService.generateContextualResponse(
            message.text,
            culturalContext
        );

        return {
            text: response,
            language
        };
    }

    async _processSpecialCommands(response, message) {
        const commands = {
            '#balance': async () => this._getAccountBalance(message.userId),
            '#help': async () => this._getHelpInformation(message.language),
            '#status': async () => this._getGameStatus(message.gameId)
        };

        for (const [command, handler] of Object.entries(commands)) {
            if (message.text.includes(command)) {
                const commandResponse = await handler();
                response.text += `\n\n${commandResponse}`;
            }
        }

        return response;
    }

    async _updateMessageStats(channelId, intent) {
        // Update message statistics for analytics
        await Channel.updateOne(
            { _id: channelId },
            {
                $inc: {
                    'analytics.totalMessages': 1,
                    [`analytics.intents.${intent.category}`]: 1
                }
            }
        );
    }
}

module.exports = new MessageHandlingService(); 