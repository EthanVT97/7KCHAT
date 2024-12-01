import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';

const UserBehaviorAnalytics = () => {
    const { t } = useTranslation();
    const [behaviorData, setBehaviorData] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('bettingPatterns');

    useEffect(() => {
        loadBehaviorData();
    }, []);

    const loadBehaviorData = async () => {
        try {
            const response = await fetch('/api/analytics/user-behavior');
            const data = await response.json();
            setBehaviorData(data);
        } catch (error) {
            console.error('Error loading behavior data:', error);
        }
    };

    const bettingPatternsData = {
        labels: ['2D', '3D', 'Football', 'Casino', 'Live Games'],
        datasets: [{
            label: t('User Preferences'),
            data: behaviorData?.bettingPatterns || [],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const timeDistributionData = {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [{
            label: t('Activity Distribution'),
            data: behaviorData?.timeDistribution || [],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    const userSegmentationData = {
        labels: [
            t('High Rollers'),
            t('Regular Players'),
            t('Casual Users'),
            t('New Users'),
            t('Inactive Users')
        ],
        datasets: [{
            label: t('User Segments'),
            data: behaviorData?.userSegments || [],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.label}: ${formatNumber(context.raw)}`;
                    }
                }
            }
        }
    };

    return (
        <motion.div
            className="user-behavior-analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="analytics-header">
                <h3>{t('User Behavior Analysis')}</h3>
                <div className="metric-selector">
                    {['bettingPatterns', 'timeDistribution', 'userSegments'].map(metric => (
                        <button
                            key={metric}
                            className={`metric-btn ${selectedMetric === metric ? 'active' : ''}`}
                            onClick={() => setSelectedMetric(metric)}
                        >
                            {t(metric)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-container">
                {selectedMetric === 'bettingPatterns' && (
                    <Bar data={bettingPatternsData} options={chartOptions} />
                )}
                {selectedMetric === 'timeDistribution' && (
                    <Bar data={timeDistributionData} options={chartOptions} />
                )}
                {selectedMetric === 'userSegments' && (
                    <Radar data={userSegmentationData} options={chartOptions} />
                )}
            </div>

            <div className="insights-panel">
                <h4>{t('Key Insights')}</h4>
                <div className="insights-grid">
                    {behaviorData?.insights.map((insight, index) => (
                        <motion.div
                            key={index}
                            className="insight-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="insight-icon">{insight.icon}</span>
                            <div className="insight-content">
                                <h5>{t(insight.title)}</h5>
                                <p>{t(insight.description)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserBehaviorAnalytics; 