const fetch = require('node-fetch');

class TranslationService {
    constructor() {
        this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
        this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    }

    async translateMessage(text, targetLang = 'my') {
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLang,
                    format: 'text'
                })
            });

            const data = await response.json();
            return {
                [targetLang]: data.data.translations[0].translatedText,
                original: text
            };
        } catch (error) {
            console.error('Translation error:', error);
            return { [targetLang]: text, original: text };
        }
    }

    async detectLanguage(text) {
        try {
            const response = await fetch(`${this.baseUrl}/detect?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text
                })
            });

            const data = await response.json();
            return data.data.detections[0][0].language;
        } catch (error) {
            console.error('Language detection error:', error);
            return 'en';
        }
    }
}

module.exports = new TranslationService(); 