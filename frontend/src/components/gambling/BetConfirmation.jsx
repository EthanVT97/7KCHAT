import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const BetConfirmation = ({ betData, onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            <div className="bet-confirmation-overlay">
                <motion.div 
                    className="bet-confirmation-modal"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                >
                    <h3>{t('Confirm Your Bet')}</h3>
                    
                    <div className="bet-details">
                        <div className="detail-row">
                            <span>{t('Game')}:</span>
                            <strong>{betData.game}</strong>
                        </div>
                        <div className="detail-row">
                            <span>{t('Amount')}:</span>
                            <strong>{formatCurrency(betData.amount)} MMK</strong>
                        </div>
                        <div className="detail-row">
                            <span>{t('Odds')}:</span>
                            <strong>{betData.odds}</strong>
                        </div>
                        <div className="detail-row highlight">
                            <span>{t('Potential Win')}:</span>
                            <strong>{formatCurrency(betData.potentialWin)} MMK</strong>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <motion.button
                            className="confirm-btn"
                            onClick={onConfirm}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('Confirm Bet')}
                        </motion.button>
                        <motion.button
                            className="cancel-btn"
                            onClick={onCancel}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('Cancel')}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BetConfirmation; 