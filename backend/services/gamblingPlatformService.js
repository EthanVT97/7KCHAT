const fetch = require('node-fetch');

class GamblingPlatformService {
    constructor() {
        this.platforms = {
            TheLordMM: {
                baseUrl: process.env.THELORDMM_API_URL,
                apiKey: process.env.THELORDMM_API_KEY
            },
            TJ89: {
                baseUrl: process.env.TJ89_API_URL,
                apiKey: process.env.TJ89_API_KEY
            },
            '9Plus': {
                baseUrl: process.env.NINEPLUS_API_URL,
                apiKey: process.env.NINEPLUS_API_KEY
            }
        };
    }

    async getAccountBalance(platform, userId) {
        try {
            const config = this.platforms[platform];
            const response = await fetch(`${config.baseUrl}/balance/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error fetching balance from ${platform}:`, error);
            throw error;
        }
    }

    async placeBet(platform, betData) {
        try {
            const config = this.platforms[platform];
            const response = await fetch(`${config.baseUrl}/bets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(betData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error placing bet on ${platform}:`, error);
            throw error;
        }
    }

    async getGameStatus(platform, gameId) {
        try {
            const config = this.platforms[platform];
            const response = await fetch(`${config.baseUrl}/games/${gameId}`, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error fetching game status from ${platform}:`, error);
            throw error;
        }
    }
}

module.exports = new GamblingPlatformService(); 