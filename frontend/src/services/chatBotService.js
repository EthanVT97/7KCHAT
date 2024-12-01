import { OpenAI } from 'openai';
import { trainModel, saveTrainingData } from './aiTrainingService';

class ChatBotService {
    constructor() {
        this.openai = new OpenAI();
        this.quickResponses = new Map();
        this.learningThreshold = 0.85;
        this.maintenanceMode = false;
    }

    async processMessage(message, platform) {
        try {
            // Check for quick responses first
            const quickResponse = this.quickResponses.get(message.toLowerCase());
            if (quickResponse) {
                return {
                    type: 'quick',
                    content: quickResponse,
                    platform
                };
            }

            // Process with AI
            const response = await this.generateAIResponse(message, platform);
            
            // Learn from interaction
            await this.learnFromInteraction(message, response);

            return response;
        } catch (error) {
            console.error('ChatBot Error:', error);
            this.handleError(error);
            return this.getErrorResponse(platform);
        }
    }

    async trainQuickResponse(trigger, response) {
        this.quickResponses.set(trigger.toLowerCase(), {
            content: response,
            confidence: 1,
            lastUsed: new Date()
        });

        await saveTrainingData({
            type: 'quick_response',
            trigger,
            response,
            timestamp: new Date()
        });
    }

    async generateAIResponse(message, platform) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `You are a helpful gaming assistant for ${platform}. Respond in the same language as the user's message.`
            }, {
                role: "user",
                content: message
            }],
            temperature: 0.7,
            max_tokens: 150
        });

        return {
            type: 'ai',
            content: completion.choices[0].message.content,
            platform,
            confidence: completion.choices[0].finish_reason === 'stop' ? 0.9 : 0.7
        };
    }

    async learnFromInteraction(message, response) {
        if (response.confidence > this.learningThreshold) {
            await trainModel({
                input: message,
                output: response.content,
                confidence: response.confidence,
                timestamp: new Date()
            });
        }
    }

    async performMaintenance() {
        try {
            this.maintenanceMode = true;

            // Clean up unused quick responses
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            for (const [trigger, data] of this.quickResponses) {
                if (data.lastUsed < oneMonthAgo) {
                    this.quickResponses.delete(trigger);
                }
            }

            // Retrain model with recent data
            await this.retrainModel();

            this.maintenanceMode = false;
        } catch (error) {
            console.error('Maintenance Error:', error);
            // Switch to fallback mode
            this.enableFallbackMode();
        }
    }

    handleError(error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            this.enableFallbackMode();
        }
        
        if (error.response?.status === 503) {
            this.scheduleRetry();
        }

        // Log error for analysis
        this.logError(error);
    }

    enableFallbackMode() {
        this.useFallbackResponses = true;
        setTimeout(() => {
            this.useFallbackResponses = false;
        }, 300000); // 5 minutes
    }

    getErrorResponse(platform) {
        const responses = {
            my: "ဝန်ဆောင်မှုတွင် ပြဿနာရှိနေပါသည်။ ခဏစောင့်ပေးပါ။",
            th: "ระบบมีปัญหา กรุณารอสักครู่",
            en: "Service is temporarily unavailable. Please try again shortly."
        };

        return {
            type: 'error',
            content: responses[platform] || responses.en,
            platform
        };
    }
}

export const chatBotService = new ChatBotService();