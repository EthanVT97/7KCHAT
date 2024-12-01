const fetch = require('node-fetch');

class TJ89Service {
    constructor() {
        this.baseUrl = process.env.TJ89_API_URL;
        this.apiKey = process.env.TJ89_API_KEY;
    }

    async getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Platform': 'TJ89'
        };
    }

    async getPromotions() {
        try {
            const response = await fetch(`${this.baseUrl}/promotions`, {
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching promotions:', error);
            throw error;
        }
    }

    async registerUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/users/register`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    async getGameResults(gameId) {
        try {
            const response = await fetch(`${this.baseUrl}/games/${gameId}/results`, {
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching game results:', error);
            throw error;
        }
    }

    async placeLiveBet(betData) {
        try {
            const response = await fetch(`${this.baseUrl}/live-betting`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(betData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error placing live bet:', error);
            throw error;
        }
    }
}

module.exports = new TJ89Service(); 