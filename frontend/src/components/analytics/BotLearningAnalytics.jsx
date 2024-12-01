import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line, Scatter } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const BotLearningAnalytics = () => {
    const { t } = useTranslation();
    const [learningData, setLearningData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadLearningData();
    }, [selectedCategory]);

    const loadLearningData = async () => {
        try {
            const response = await fetch(`/api/analytics/bot-learning?category=${selectedCategory}`);
            const data = await response.json();
            setLearningData(data);
        } catch (error) {
            console.error('Error loading learning data:', error);
        }
    };

    const improvementTrendData = {
        labels: learningData?.timeLabels || [],
        datasets: [
            {
                label: t('Cultural Understanding'),
                data: learningData?.culturalScores || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4
            },
            {
                label: t('Response Accuracy'),
                data: learningData?.accuracyScores || [],
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.4
            }
        ]
    };

    const learningPatternData = {
        datasets: [{
            label: t('Learning Patterns'),
            data: learningData?.learningPatterns || [],
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }]
    };

    return (
        <motion.div
            className="bot-learning-analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="learning-header">
                <h3>{t('AI Bot Learning Analysis')}</h3>
                <div className="category-selector">
                    {['all', 'cultural', 'gambling', 'support'].map(category => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {t(category)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="learning-metrics">
                <div className="metric-card">
                    <h4>{t('New Patterns Learned')}</h4>
                    <span className="metric-value">{learningData?.newPatterns}</span>
                    <span className="time-period">{t('Last 24 hours')}</span>
                </div>
                <div className="metric-card">
                    <h4>{t('Improvement Rate')}</h4>
                    <span className="metric-value">{learningData?.improvementRate}%</span>
                    <span className="time-period">{t('Week over Week')}</span>
                </div>
                <div className="metric-card">
                    <h4>{t('Cultural Adaptation Score')}</h4>
                    <span className="metric-value">{learningData?.adaptationScore}/100</span>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-section">
                    <h4>{t('Improvement Trends')}</h4>
                    <Line
                        data={improvementTrendData}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100
                                }
                            }
                        }}
                    />
                </div>

                <div className="chart-section">
                    <h4>{t('Learning Pattern Distribution')}</h4>
                    <Scatter
                        data={learningPatternData}
                        options={{
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: t('Complexity')
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: t('Success Rate')
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="learning-insights">
                <h4>{t('Key Learning Insights')}</h4>
                <div className="insights-grid">
                    {learningData?.insights.map((insight, index) => (
                        <motion.div
                            key={index}
                            className="insight-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="insight-header">
                                <span className="insight-type">{t(insight.type)}</span>
                                <span className="insight-score">{insight.score}%</span>
                            </div>
                            <p className="insight-description">{t(insight.description)}</p>
                            <div className="insight-examples">
                                {insight.examples.map((example, i) => (
                                    <div key={i} className="example-item">
                                        <div className="before">{example.before}</div>
                                        <div className="arrow">→</div>
                                        <div className="after">{example.after}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="adaptation-metrics">
                <h4>{t('Cultural Adaptation Metrics')}</h4>
                <div className="adaptation-grid">
                    {learningData?.adaptationMetrics.map((metric, index) => (
                        <div key={index} className="adaptation-card">
                            <h5>{t(metric.name)}</h5>
                            <div className="progress-bar">
                                <div 
                                    className="progress"
                                    style={{ width: `${metric.progress}%` }}
                                />
                            </div>
                            <span className="progress-value">{metric.progress}%</span>
                            <p>{t(metric.description)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default BotLearningAnalytics; 