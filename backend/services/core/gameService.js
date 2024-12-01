const Channel = require('../../models/Channel');
const Game = require('../../models/Game');
const queueService = require('../queueService');
const oddsService = require('./oddsService');

class GameService {
    constructor() {
        this.supportedGameTypes = ['football', 'casino', '2d', '3d'];
        this.gameStatuses = {
            PENDING: 'pending',
            ACTIVE: 'active',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled'
        };
    }

    async createGame(gameData) {
        try {
            // Validate game data
            this.validateGameData(gameData);

            // Create game instance
            const game = await Game.create({
                ...gameData,
                status: this.gameStatuses.PENDING,
                createdAt: new Date()
            });

            // Initialize odds for the game
            await oddsService.initializeOdds(game.id, gameData.type);

            // Queue game start job
            await queueService.addJob('games', {
                type: 'START_GAME',
                gameId: game.id,
                scheduledTime: gameData.startTime
            });

            return game;
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    }

    async updateGameStatus(gameId, status, result = null) {
        try {
            const game = await Game.findByIdAndUpdate(
                gameId,
                {
                    status,
                    result,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (status === this.gameStatuses.COMPLETED) {
                await this.processGameCompletion(game);
            }

            return game;
        } catch (error) {
            console.error('Error updating game status:', error);
            throw error;
        }
    }

    async processGameCompletion(game) {
        try {
            // Process all bets for the game
            const bets = await this.getGameBets(game.id);
            
            for (const bet of bets) {
                await queueService.addJob('bets', {
                    type: 'PROCESS_BET_RESULT',
                    betId: bet.id,
                    gameResult: game.result
                });
            }

            // Update game statistics
            await this.updateGameStats(game.id);
        } catch (error) {
            console.error('Error processing game completion:', error);
            throw error;
        }
    }

    validateGameData(gameData) {
        if (!this.supportedGameTypes.includes(gameData.type)) {
            throw new Error('Unsupported game type');
        }

        if (new Date(gameData.startTime) <= new Date()) {
            throw new Error('Game start time must be in the future');
        }

        // Add more validations as needed
    }

    async getActiveGames(filter = {}) {
        try {
            const query = {
                status: this.gameStatuses.ACTIVE,
                ...filter
            };

            const games = await Game.find(query)
                .populate('odds')
                .sort({ startTime: 1 });

            return games;
        } catch (error) {
            console.error('Error fetching active games:', error);
            throw error;
        }
    }

    async getGameBets(gameId) {
        // Implementation needed
        return [];
    }

    async updateGameStats(gameId) {
        // Implementation needed
    }
}

module.exports = new GameService(); 