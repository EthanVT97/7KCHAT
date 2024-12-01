const Game = require('../models/Game');
const Bet = require('../models/Bet');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.placeBet = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { gameId, amount, odds } = req.body;
        const userId = req.user.id;

        // Get game and validate
        const game = await Game.findById(gameId);
        if (!game) {
            throw new Error('Game not found');
        }

        if (game.status !== 'upcoming' && game.status !== 'live') {
            throw new Error('Game is not accepting bets');
        }

        // Validate bet amount
        if (amount < game.limits.minBet || amount > game.limits.maxBet) {
            throw new Error(`Bet amount must be between ${game.limits.minBet} and ${game.limits.maxBet}`);
        }

        // Create bet
        const bet = await Bet.create([{
            user: userId,
            game: gameId,
            platform: game.platform,
            amount,
            odds,
            metadata: {
                ip: req.ip,
                device: req.headers['user-agent'],
                location: req.body.location
            }
        }], { session });

        // Update game metadata
        await Game.findByIdAndUpdate(gameId, {
            $inc: {
                'metadata.totalBets': 1,
                'metadata.totalAmount': amount,
                'metadata.participants': 1
            }
        }, { session });

        await session.commitTransaction();
        
        const populatedBet = await Bet.findById(bet[0]._id)
            .populate('game', 'title type startTime')
            .populate('user', 'username');

        res.status(201).json(populatedBet);
    } catch (error) {
        await session.abortTransaction();
        console.error('Error placing bet:', error);
        res.status(500).json({ message: 'Error placing bet', error: error.message });
    } finally {
        session.endSession();
    }
};

exports.getBetHistory = async (req, res) => {
    try {
        const { status, platform, startDate, endDate } = req.query;
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const query = { user: userId };

        if (status) query.status = status;
        if (platform) query.platform = platform;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const bets = await Bet.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('game', 'title type startTime')
            .lean();

        const total = await Bet.countDocuments(query);

        res.json({
            bets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting bet history:', error);
        res.status(500).json({ message: 'Error getting bet history', error: error.message });
    }
};

exports.getBetStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, timeRange = '7d' } = req.query;

        const dateRange = getDateRange(timeRange);
        const query = {
            user: userId,
            createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        };
        if (platform) query.platform = platform;

        const stats = await Bet.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalBets: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalWinAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', 'won'] },
                                '$result.winAmount',
                                0
                            ]
                        }
                    },
                    wonBets: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', 'won'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            timeRange,
            platform,
            statistics: stats[0] || {
                totalBets: 0,
                totalAmount: 0,
                totalWinAmount: 0,
                wonBets: 0
            }
        });
    } catch (error) {
        console.error('Error getting bet statistics:', error);
        res.status(500).json({ message: 'Error getting bet statistics', error: error.message });
    }
};

function getDateRange(timeRange) {
    const end = new Date();
    const start = new Date();

    switch (timeRange) {
        case '24h':
            start.setHours(start.getHours() - 24);
            break;
        case '7d':
            start.setDate(start.getDate() - 7);
            break;
        case '30d':
            start.setDate(start.getDate() - 30);
            break;
        case '90d':
            start.setDate(start.getDate() - 90);
            break;
        default:
            start.setDate(start.getDate() - 7);
    }

    return { start, end };
} 