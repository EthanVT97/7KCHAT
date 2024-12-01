import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';

const GameList = ({ onGameSelect }) => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [games, setGames] = useState([]);
    const [filter, setFilter] = useState({
        platform: 'all',
        type: 'all',
        status: 'upcoming'
    });

    useEffect(() => {
        loadGames();
        socket.on('odds_update', handleOddsUpdate);
        socket.on('game_status_update', handleStatusUpdate);

        return () => {
            socket.off('odds_update');
            socket.off('game_status_update');
        };
    }, [filter]);

    const loadGames = async () => {
        try {
            const queryParams = new URLSearchParams(filter).toString();
            const response = await fetch(`/api/games?${queryParams}`);
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error('Error loading games:', error);
        }
    };

    const handleOddsUpdate = (update) => {
        setGames(prevGames => 
            prevGames.map(game => 
                game._id === update.gameId 
                    ? { ...game, odds: update.odds }
                    : game
            )
        );
    };

    const handleStatusUpdate = (update) => {
        setGames(prevGames => 
            prevGames.map(game => 
                game._id === update.gameId 
                    ? { ...game, status: update.status }
                    : game
            )
        );
    };

    return (
        <div className="game-list">
            <div className="filters">
                <select 
                    value={filter.platform} 
                    onChange={e => setFilter(prev => ({ ...prev, platform: e.target.value }))}
                >
                    <option value="all">{t('All Platforms')}</option>
                    <option value="TheLordMM">TheLordMM</option>
                    <option value="TJ89">TJ89</option>
                    <option value="9Plus">9Plus</option>
                </select>

                <select 
                    value={filter.type} 
                    onChange={e => setFilter(prev => ({ ...prev, type: e.target.value }))}
                >
                    <option value="all">{t('All Types')}</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="football">{t('Football')}</option>
                    <option value="casino">{t('Casino')}</option>
                </select>

                <select 
                    value={filter.status} 
                    onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="upcoming">{t('Upcoming')}</option>
                    <option value="live">{t('Live')}</option>
                    <option value="ended">{t('Ended')}</option>
                </select>
            </div>

            <AnimatePresence>
                <div className="games-grid">
                    {games.map(game => (
                        <motion.div
                            key={game._id}
                            className={`game-card ${game.status}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={() => onGameSelect(game)}
                        >
                            <div className="game-header">
                                <h3>{game.title}</h3>
                                <span className={`status-badge ${game.status}`}>
                                    {t(game.status)}
                                </span>
                            </div>

                            <div className="game-info">
                                <div className="platform">
                                    <span className="label">{t('Platform')}:</span>
                                    <span>{game.platform}</span>
                                </div>
                                <div className="type">
                                    <span className="label">{t('Type')}:</span>
                                    <span>{game.type}</span>
                                </div>
                                <div className="time">
                                    <span className="label">{t('Start Time')}:</span>
                                    <span>{formatDateTime(game.startTime)}</span>
                                </div>
                            </div>

                            <div className="game-limits">
                                <div className="min-bet">
                                    <span className="label">{t('Min Bet')}:</span>
                                    <span>{formatCurrency(game.limits.minBet)}</span>
                                </div>
                                <div className="max-bet">
                                    <span className="label">{t('Max Bet')}:</span>
                                    <span>{formatCurrency(game.limits.maxBet)}</span>
                                </div>
                            </div>

                            {game.status === 'live' && (
                                <div className="live-indicator">
                                    <span className="pulse"></span>
                                    {t('LIVE')}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
};

export default GameList; 