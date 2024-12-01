const TheLordMMService = require('../services/gamblingIntegrations/theLordMMService');
const TJ89Service = require('../services/gamblingIntegrations/tj89Service');
const aiService = require('../services/aiService');
const NinePlusService = require('../services/gamblingIntegrations/ninePlusService');
const responsibleGamblingService = require('../services/responsibleGamblingService');

exports.getGameStatus = async (req, res) => {
    try {
        const { platform, gameId } = req.params;
        let gameStatus;

        switch (platform) {
            case 'TheLordMM':
                gameStatus = await TheLordMMService.getGameResults(gameId);
                break;
            case 'TJ89':
                gameStatus = await TJ89Service.getGameResults(gameId);
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(gameStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game status', error: error.message });
    }
};

exports.processTransaction = async (req, res) => {
    try {
        const { platform, type } = req.params;
        const userData = req.body;

        let result;
        switch (platform) {
            case 'TheLordMM':
                result = type === 'deposit' 
                    ? await TheLordMMService.processDeposit(userData)
                    : await TheLordMMService.processWithdrawal(userData);
                break;
            case 'TJ89':
                // Implement TJ89 transaction processing
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error processing transaction', error: error.message });
    }
};

exports.getBettingHistory = async (req, res) => {
    try {
        const { platform, userId } = req.params;
        let history;

        switch (platform) {
            case 'TheLordMM':
                history = await TheLordMMService.getBettingHistory(userId);
                break;
            case 'TJ89':
                // Implement TJ89 betting history
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching betting history', error: error.message });
    }
};

exports.getLiveGames = async (req, res) => {
    try {
        const { platform } = req.params;
        let games;

        switch (platform) {
            case 'TheLordMM':
                games = await TheLordMMService.getLiveGames();
                break;
            case 'TJ89':
                games = await TJ89Service.getLiveGames();
                break;
            case '9Plus':
                games = await NinePlusService.getLiveGames();
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live games', error: error.message });
    }
};

exports.getOdds = async (req, res) => {
    try {
        const { platform, gameId } = req.params;
        let odds;

        switch (platform) {
            case '9Plus':
                odds = await NinePlusService.getOdds(gameId);
                break;
            // Add other platform implementations
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(odds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching odds', error: error.message });
    }
};

exports.getPromotions = async (req, res) => {
    try {
        const { platform } = req.params;
        let promotions;

        switch (platform) {
            case 'TJ89':
                promotions = await TJ89Service.getPromotions();
                break;
            case '9Plus':
                promotions = await NinePlusService.getPromotions();
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promotions', error: error.message });
    }
};

exports.getTransactionSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const summary = {
            totalDeposits: 0,
            totalWithdrawals: 0,
            pendingTransactions: [],
            recentTransactions: []
        };

        // Aggregate transactions from all platforms
        const [theLordMMTx, tj89Tx, ninePlusTx] = await Promise.all([
            TheLordMMService.getBettingHistory(userId),
            // Add TJ89 implementation
            NinePlusService.getTransactionHistory(userId)
        ]);

        // Process and combine transactions
        const allTransactions = [...theLordMMTx, ...ninePlusTx]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        summary.recentTransactions = allTransactions.slice(0, 10);
        summary.pendingTransactions = allTransactions.filter(tx => tx.status === 'pending');

        // Calculate totals
        allTransactions.forEach(tx => {
            if (tx.type === 'deposit') summary.totalDeposits += tx.amount;
            if (tx.type === 'withdrawal') summary.totalWithdrawals += tx.amount;
        });

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction summary', error: error.message });
    }
};

exports.placeBet = async (req, res) => {
    try {
        const { platform, betAmount } = req.body;
        const userId = req.user._id;

        // Check betting limits before placing bet
        const limitCheck = await responsibleGamblingService.checkBettingLimit(
            userId,
            platform,
            betAmount
        );

        if (!limitCheck.allowed) {
            return res.status(403).json({
                message: 'Betting limit exceeded',
                details: limitCheck
            });
        }

        // Proceed with placing the bet
        let result;
        switch (platform) {
            case 'TheLordMM':
                result = await TheLordMMService.placeBet(req.body);
                break;
            case 'TJ89':
                result = await TJ89Service.placeLiveBet(req.body);
                break;
            case '9Plus':
                result = await NinePlusService.placeBet(req.body);
                break;
            default:
                return res.status(400).json({ message: 'Unsupported platform' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error placing bet', error: error.message });
    }
}; 