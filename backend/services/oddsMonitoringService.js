const WebSocket = require('ws');
const TheLordMMService = require('./gamblingIntegrations/theLordMMService');
const TJ89Service = require('./gamblingIntegrations/tj89Service');
const NinePlusService = require('./gamblingIntegrations/ninePlusService');

class OddsMonitoringService {
    constructor() {
        this.connections = new Map();
        this.subscribers = new Map();
        this.oddsCache = new Map();
    }

    async startMonitoring(platform, gameId) {
        const connectionKey = `${platform}:${gameId}`;
        
        if (this.connections.has(connectionKey)) {
            return;
        }

        let wsUrl;
        switch (platform) {
            case 'TheLordMM':
                wsUrl = `${process.env.THELORDMM_WS_URL}/odds/${gameId}`;
                break;
            case 'TJ89':
                wsUrl = `${process.env.TJ89_WS_URL}/odds/${gameId}`;
                break;
            case '9Plus':
                wsUrl = `${process.env.NINEPLUS_WS_URL}/odds/${gameId}`;
                break;
            default:
                throw new Error('Unsupported platform');
        }

        const ws = new WebSocket(wsUrl);

        ws.on('message', (data) => {
            const odds = JSON.parse(data);
            this.oddsCache.set(connectionKey, odds);
            this._notifySubscribers(connectionKey, odds);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error for ${connectionKey}:`, error);
            this._reconnect(platform, gameId);
        });

        this.connections.set(connectionKey, ws);
    }

    async subscribeToOdds(platform, gameId, callback) {
        const connectionKey = `${platform}:${gameId}`;
        
        if (!this.subscribers.has(connectionKey)) {
            this.subscribers.set(connectionKey, new Set());
        }
        
        this.subscribers.get(connectionKey).add(callback);

        // Start monitoring if not already started
        await this.startMonitoring(platform, gameId);

        // Send cached odds immediately if available
        if (this.oddsCache.has(connectionKey)) {
            callback(this.oddsCache.get(connectionKey));
        }

        return () => {
            this.subscribers.get(connectionKey).delete(callback);
            if (this.subscribers.get(connectionKey).size === 0) {
                this._stopMonitoring(platform, gameId);
            }
        };
    }

    _notifySubscribers(connectionKey, odds) {
        if (this.subscribers.has(connectionKey)) {
            this.subscribers.get(connectionKey).forEach(callback => {
                callback(odds);
            });
        }
    }

    async _reconnect(platform, gameId) {
        const connectionKey = `${platform}:${gameId}`;
        if (this.connections.has(connectionKey)) {
            this.connections.get(connectionKey).terminate();
            this.connections.delete(connectionKey);
        }
        await this.startMonitoring(platform, gameId);
    }

    _stopMonitoring(platform, gameId) {
        const connectionKey = `${platform}:${gameId}`;
        if (this.connections.has(connectionKey)) {
            this.connections.get(connectionKey).close();
            this.connections.delete(connectionKey);
        }
        this.oddsCache.delete(connectionKey);
    }
}

module.exports = new OddsMonitoringService(); 