import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatOdds } from '../../utils/formatters';

const OddsDisplay = ({ odds, selectedOdds, onSelect }) => {
    const { t } = useTranslation();

    const handleOddsClick = (value) => {
        onSelect(selectedOdds === value ? null : value);
    };

    const renderOddsButton = (value, label) => (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`odds-button ${selectedOdds === value ? 'selected' : ''}`}
            onClick={() => handleOddsClick(value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <span className="odds-label">{label}</span>
            <span className="odds-value">{formatOdds(value)}</span>
        </motion.button>
    );

    return (
        <div className="odds-display">
            <h4 className="odds-title">{t('Select Odds')}</h4>
            <div className="odds-grid">
                {Object.entries(odds).map(([key, value]) => (
                    renderOddsButton(value, t(key))
                ))}
            </div>
        </div>
    );
};

export default OddsDisplay; 