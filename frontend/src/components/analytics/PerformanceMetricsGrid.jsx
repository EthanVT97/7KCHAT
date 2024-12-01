import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PerformanceMetricsGrid = ({ metrics }) => {
    const { t } = useTranslation();

    const metricCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(metrics.totalRevenue),
            trend: metrics.revenueTrend,
            icon: '💰'
        },
        {
            title: 'User Retention',
            value: formatPercentage(metrics.retention),
            trend: metrics.retentionTrend,
            icon: '👥'
        },
        {
            title: 'Average Bet Size',
            value: formatCurrency(metrics.avgBetSize),
            trend: metrics.betSizeTrend,
            icon: '🎲'
        },
        {
            title: 'Win Rate',
            value: formatPercentage(metrics.winRate),
            trend: metrics.winRateTrend,
            icon: '🎯'
        }
    ];

    return (
        <div className="performance-metrics-grid">
            {metricCards.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    className="metric-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="metric-header">
                        <span className="metric-icon">{metric.icon}</span>
                        <h4>{t(metric.title)}</h4>
                    </div>
                    <div className="metric-value">
                        {metric.value}
                        <TrendIndicator trend={metric.trend} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const TrendIndicator = ({ trend }) => {
    const isPositive = trend > 0;
    const isNeutral = trend === 0;

    return (
        <div className={`trend-indicator ${isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'}`}>
            {isPositive ? '↑' : isNeutral ? '→' : '↓'}
            <span>{Math.abs(trend)}%</span>
        </div>
    );
};

export default PerformanceMetricsGrid; 