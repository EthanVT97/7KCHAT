import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PlatformPerformanceComparison = ({ data }) => {
    const { t } = useTranslation();
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [comparisonMetric, setComparisonMetric] = useState('revenue');

    const metrics = {
        revenue: {
            label: t('Revenue'),
            format: formatCurrency,
            color: 'rgba(75, 192, 192, 1)'
        },
        userGrowth: {
            label: t('User Growth'),
            format: formatPercentage,
            color: 'rgba(255, 99, 132, 1)'
        },
        conversionRate: {
            label: t('Conversion Rate'),
            format: formatPercentage,
            color: 'rgba(153, 102, 255, 1)'
        }
    };

    const comparisonData = {
        labels: data.platforms.map(p => p.name),
        datasets: [{
            label: metrics[comparisonMetric].label,
            data: data.platforms.map(p => p[comparisonMetric]),
            backgroundColor: metrics[comparisonMetric].color,
            borderColor: metrics[comparisonMetric].color,
            borderWidth: 1
        }]
    };

    const trendData = selectedPlatform ? {
        labels: data.timeLabels,
        datasets: [{
            label: selectedPlatform.name,
            data: selectedPlatform.trends[comparisonMetric],
            borderColor: metrics[comparisonMetric].color,
            tension: 0.4,
            fill: false
        }]
    } : null;

    return (
        <motion.div
            className="platform-performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="performance-header">
                <h3>{t('Platform Performance Comparison')}</h3>
                <div className="metric-selector">
                    {Object.keys(metrics).map(metric => (
                        <button
                            key={metric}
                            className={`metric-btn ${comparisonMetric === metric ? 'active' : ''}`}
                            onClick={() => setComparisonMetric(metric)}
                        >
                            {metrics[metric].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="comparison-chart">
                <Bar
                    data={comparisonData}
                    options={{
                        onClick: (_, elements) => {
                            if (elements.length > 0) {
                                const index = elements[0].index;
                                setSelectedPlatform(data.platforms[index]);
                            }
                        }
                    }}
                />
            </div>

            <AnimatePresence>
                {selectedPlatform && (
                    <motion.div
                        className="platform-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="details-header">
                            <h4>{selectedPlatform.name}</h4>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedPlatform(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="trend-chart">
                            <Line data={trendData} />
                        </div>

                        <div className="platform-stats">
                            {Object.entries(metrics).map(([key, metric]) => (
                                <div key={key} className="stat-item">
                                    <span className="stat-label">{metric.label}</span>
                                    <span className="stat-value">
                                        {metric.format(selectedPlatform[key])}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PlatformPerformanceComparison; 