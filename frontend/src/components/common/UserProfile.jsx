import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = ({ compact = false }) => {
    const { t } = useTranslation();
    const { user, logout, updateStatus } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const statusOptions = [
        { id: 'online', label: 'Online', icon: '🟢' },
        { id: 'busy', label: 'Busy', icon: '🔴' },
        { id: 'away', label: 'Away', icon: '🟡' }
    ];

    const handleStatusChange = async (status) => {
        try {
            await updateStatus(status);
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="user-profile">
            <motion.button
                className="profile-trigger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                    ) : (
                        <span className="avatar-placeholder">
                            {user.username.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className={`status-indicator ${user.status}`} />
                </div>

                {!compact && (
                    <div className="user-info">
                        <span className="username">{user.username}</span>
                        <span className="role">{t(user.role)}</span>
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="profile-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="menu-header">
                            <h3>{t('Profile')}</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="menu-content">
                            <div className="status-selector">
                                <h4>{t('Status')}</h4>
                                <div className="status-options">
                                    {statusOptions.map(status => (
                                        <motion.button
                                            key={status.id}
                                            className={`status-btn ${user.status === status.id ? 'active' : ''}`}
                                            onClick={() => handleStatusChange(status.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="icon">{status.icon}</span>
                                            <span className="label">{t(status.label)}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="user-stats">
                                <div className="stat-item">
                                    <span className="label">{t('Balance')}</span>
                                    <span className="value">{user.balance} MMK</span>
                                </div>
                                <div className="stat-item">
                                    <span className="label">{t('Total Bets')}</span>
                                    <span className="value">{user.totalBets}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="label">{t('Win Rate')}</span>
                                    <span className="value">{user.winRate}%</span>
                                </div>
                            </div>

                            <div className="menu-actions">
                                <motion.button
                                    className="action-btn"
                                    onClick={() => {/* Navigate to settings */}}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="icon">⚙️</span>
                                    {t('Settings')}
                                </motion.button>

                                <motion.button
                                    className="action-btn logout"
                                    onClick={logout}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="icon">🚪</span>
                                    {t('Logout')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfile; 