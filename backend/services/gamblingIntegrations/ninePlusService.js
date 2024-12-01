const fetch = require('node-fetch');

class NinePlusService {
    constructor() {
        this.baseUrl = process.env.NINEPLUS_API_URL;
        this.apiKey = process.env.NINEPLUS_API_KEY;
    }

    async getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Platform': '9Plus'
        };
    }

    async getLiveGames() {
        try {
            const response = await fetch(`${this.baseUrl}/live-games`, {
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching live games:', error);
            throw error;
        }
    }

    async getOdds(gameId) {
        try {
            const response = await fetch(`${this.baseUrl}/games/${gameId}/odds`, {
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching odds:', error);
            throw error;
        }
    }

    async placeBet(betData) {
        try {
            const response = await fetch(`${this.baseUrl}/bets`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(betData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error placing bet:', error);
            throw error;
        }
    }

    async getTransactionHistory(userId, type = 'all') {
        try {
            const response = await fetch(
                `${this.baseUrl}/users/${userId}/transactions?type=${type}`,
                { headers: await this.getHeaders() }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            throw error;
        }
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
}

module.exports = new NinePlusService(); 