const fetch = require('node-fetch');

class TheLordMMService {
    constructor() {
        this.baseUrl = process.env.THELORDMM_API_URL;
        this.apiKey = process.env.THELORDMM_API_KEY;
    }

    async getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
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

    async processDeposit(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/deposits`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing deposit:', error);
            throw error;
        }
    }

    async processWithdrawal(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/withdrawals`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            throw error;
        }
    }

    async getBettingHistory(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${userId}/betting-history`, {
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching betting history:', error);
            throw error;
        }
    }
}

module.exports = new TheLordMMService(); 