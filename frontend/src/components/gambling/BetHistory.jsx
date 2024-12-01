import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BetHistory = () => {
    const { t } = useTranslation();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadBetHistory();
    }, [filter]);

    const loadBetHistory = async () => {
        try {
            const response = await fetch(`/api/gambling/history?filter=${filter}`);
            const data = await response.json();
            setBets(data);
        } catch (error) {
            console.error('Error loading bet history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getBetStatusColor = (status) => {
        switch (status) {
            case 'won': return 'var(--color-success)';
            case 'lost': return 'var(--color-error)';
            case 'pending': return 'var(--color-warning)';
            default: return 'var(--color-text)';
        }
    };

    return (
        <div className="bet-history">
            <div className="history-header">
                <h3>{t('Betting History')}</h3>
                <div className="filter-buttons">
                    {['all', 'won', 'lost', 'pending'].map((type) => (
                        <button
                            key={type}
                            className={`filter-btn ${filter === type ? 'active' : ''}`}
                            onClick={() => setFilter(type)}
                        >
                            {t(type.charAt(0).toUpperCase() + type.slice(1))}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner" />
            ) : (
                <motion.div 
                    className="bets-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {bets.map((bet) => (
                        <motion.div
                            key={bet.id}
                            className="bet-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="bet-info">
                                <span className="bet-game">{bet.game}</span>
                                <span className="bet-date">
                                    {formatDate(bet.date)}
                                </span>
                            </div>
                            <div className="bet-details">
                                <div className="bet-amount">
                                    {formatCurrency(bet.amount)} MMK
                                </div>
                                <div className="bet-odds">
                                    {bet.odds}
                                </div>
                                <div 
                                    className="bet-status"
                                    style={{ color: getBetStatusColor(bet.status) }}
                                >
                                    {t(bet.status)}
                                </div>
                            </div>
                            {bet.status === 'won' && (
                                <div className="bet-winnings">
                                    +{formatCurrency(bet.winnings)} MMK
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default BetHistory;