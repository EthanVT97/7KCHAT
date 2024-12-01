const { OpenAI } = require('openai');

class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateResponse(message) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful customer service assistant for a gambling and social media platform. Respond professionally and concisely in both English and Burmese languages."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 150
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('AI response generation error:', error);
            return "I apologize, but I'm unable to process your request at the moment. Please try again later.";
        }
    }

    async moderateContent(text) {
        try {
            const response = await this.openai.moderations.create({
                input: text
            });

            return {
                flagged: response.results[0].flagged,
                categories: response.results[0].categories
            };
        } catch (error) {
            console.error('Content moderation error:', error);
            return { flagged: false, categories: {} };
        }
    }

    async generatePlatformSpecificResponse(message, platform) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a customer service assistant for ${platform.name}. 
                                Platform type: ${platform.type}. 
                                Respond professionally in both English and Burmese languages.
                                Follow these rules: ${platform.settings.moderationRules.map(r => r.type).join(', ')}`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 150
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Platform-specific AI response error:', error);
            return "Sorry, I couldn't process your request. Please try again later.";
        }
    }

    async analyzeCustomerSentiment(messages) {
        try {
            const analysis = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Analyze the customer sentiment in the conversation. Return a JSON with sentiment score and key points."
                    },
                    {
                        role: "user",
                        content: JSON.stringify(messages)
                    }
                ]
            });

            return JSON.parse(analysis.choices[0].message.content);
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return { sentiment: 'neutral', score: 0.5 };
        }
    }
}

module.exports = new AIService(); 