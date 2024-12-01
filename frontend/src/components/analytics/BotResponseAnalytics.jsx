import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const BotResponseAnalytics = () => {
    const { t } = useTranslation();
    const [timeFrame, setTimeFrame] = useState('24h');
    const [botMetrics, setBotMetrics] = useState(null);

    useEffect(() => {
        loadBotMetrics();
    }, [timeFrame]);

    const loadBotMetrics = async () => {
        try {
            const response = await fetch(`/api/analytics/bot-metrics?timeFrame=${timeFrame}`);
            const data = await response.json();
            setBotMetrics(data);
        } catch (error) {
            console.error('Error loading bot metrics:', error);
        }
    };

    const responseTimeData = {
        labels: botMetrics?.timeLabels || [],
        datasets: [{
            label: t('Average Response Time (ms)'),
            data: botMetrics?.responseTimes || [],
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4,
            fill: false
        }]
    };

    const languageDistributionData = {
        labels: ['Myanmar', 'English', 'Chinese', 'Thai'],
        datasets: [{
            data: botMetrics?.languageDistribution || [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ]
        }]
    };

    const accuracyData = {
        labels: botMetrics?.timeLabels || [],
        datasets: [{
            label: t('Response Accuracy'),
            data: botMetrics?.accuracyScores || [],
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.4,
            fill: false
        }]
    };

    return (
        <motion.div
            className="bot-response-analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="analytics-header">
                <h3>{t('AI Bot Performance Analytics')}</h3>
                <div className="time-selector">
                    {['24h', '7d', '30d'].map(period => (
                        <button
                            key={period}
                            className={`time-btn ${timeFrame === period ? 'active' : ''}`}
                            onClick={() => setTimeFrame(period)}
                        >
                            {t(period)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h4>{t('Total Interactions')}</h4>
                    <span className="metric-value">{botMetrics?.totalInteractions}</span>
                    <span className="metric-trend">
                        {botMetrics?.interactionTrend >= 0 ? '+' : ''}
                        {botMetrics?.interactionTrend}%
                    </span>
                </div>
                <div className="metric-card">
                    <h4>{t('Success Rate')}</h4>
                    <span className="metric-value">{botMetrics?.successRate}%</span>
                </div>
                <div className="metric-card">
                    <h4>{t('Avg Response Time')}</h4>
                    <span className="metric-value">{botMetrics?.avgResponseTime}ms</span>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-section">
                    <h4>{t('Response Time Trend')}</h4>
                    <Line 
                        data={responseTimeData}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: t('Response Time (ms)')
                                    }
                                }
                            }
                        }}
                    />
                </div>

                <div className="chart-section">
                    <h4>{t('Language Distribution')}</h4>
                    <Pie 
                        data={languageDistributionData}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'right'
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="response-analysis">
                <h4>{t('Common User Queries')}</h4>
                <div className="query-list">
                    {botMetrics?.topQueries.map((query, index) => (
                        <motion.div
                            key={index}
                            className="query-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="query-text">{query.text}</span>
                            <span className="query-count">{query.count}</span>
                            <span className="success-rate">{query.successRate}%</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="cultural-context-analysis">
                <h4>{t('Myanmar Cultural Context Performance')}</h4>
                <div className="context-metrics">
                    <div className="context-metric">
                        <span>{t('Cultural Accuracy')}</span>
                        <strong>{botMetrics?.culturalAccuracy}%</strong>
                    </div>
                    <div className="context-metric">
                        <span>{t('Local Expression Recognition')}</span>
                        <strong>{botMetrics?.localExpressionRate}%</strong>
                    </div>
                    <div className="context-metric">
                        <span>{t('Cultural Sensitivity')}</span>
                        <strong>{botMetrics?.culturalSensitivity}%</strong>
                    </div>
                </div>
                <div className="improvement-suggestions">
                    <h5>{t('Improvement Areas')}</h5>
                    <ul>
                        {botMetrics?.improvementSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default BotResponseAnalytics; 