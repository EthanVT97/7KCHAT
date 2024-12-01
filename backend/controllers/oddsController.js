const OddsMonitoringService = require('../services/oddsMonitoringService');

exports.subscribeToOdds = async (req, res) => {
    try {
        const { platform, gameId } = req.params;
        
        // Set up SSE (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Subscribe to odds updates
        const unsubscribe = await OddsMonitoringService.subscribeToOdds(
            platform,
            gameId,
            (odds) => {
                res.write(`data: ${JSON.stringify(odds)}\n\n`);
            }
        );

        // Handle client disconnect
        req.on('close', () => {
            unsubscribe();
        });
    } catch (error) {
        res.status(500).json({ message: 'Error subscribing to odds', error: error.message });
    }
};

exports.getLatestOdds = async (req, res) => {
    try {
        const { platform, gameId } = req.params;
        const connectionKey = `${platform}:${gameId}`;
        
        // Start monitoring if not already started
        await OddsMonitoringService.startMonitoring(platform, gameId);
        
        // Get cached odds
        const odds = OddsMonitoringService.oddsCache.get(connectionKey);
        
        if (!odds) {
            return res.status(404).json({ message: 'No odds available for this game' });
        }
        
        res.json(odds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching odds', error: error.message });
    }
}; 