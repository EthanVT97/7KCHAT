import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radar, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const CulturalContextAnalytics = ({ data }) => {
    const { t } = useTranslation();
    const [selectedContext, setSelectedContext] = useState(null);

    const contextualPerformanceData = {
        labels: [
            t('Greeting Etiquette'),
            t('Local Expressions'),
            t('Cultural References'),
            t('Language Formality'),
            t('Regional Dialects'),
            t('Cultural Sensitivity')
        ],
        datasets: [{
            label: t('Performance Score'),
            data: data.contextualScores,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
        }]
    };

    const radarOptions = {
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <motion.div
            className="cultural-context-analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="context-header">
                <h3>{t('Cultural Context Analysis')}</h3>
                <p>{t('Analysis of bot performance in Myanmar cultural context')}</p>
            </div>

            <div className="context-overview">
                <div className="radar-chart">
                    <Radar data={contextualPerformanceData} options={radarOptions} />
                </div>

                <div className="context-metrics">
                    {data.contextMetrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            className="metric-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedContext(metric)}
                        >
                            <h4>{t(metric.name)}</h4>
                            <div className="score">
                                <span className="value">{metric.score}%</span>
                                <span className={`trend ${metric.trend >= 0 ? 'positive' : 'negative'}`}>
                                    {metric.trend >= 0 ? '↑' : '↓'} {Math.abs(metric.trend)}%
                                </span>
                            </div>
                            <p>{t(metric.description)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedContext && (
                <motion.div
                    className="context-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <div className="details-header">
                        <h4>{t(selectedContext.name)}</h4>
                        <button onClick={() => setSelectedContext(null)}>×</button>
                    </div>

                    <div className="examples-list">
                        {selectedContext.examples.map((example, index) => (
                            <div key={index} className="example-item">
                                <div className="user-query">{example.query}</div>
                                <div className="bot-response">{example.response}</div>
                                <div className="context-score">
                                    {t('Cultural Accuracy')}: {example.accuracy}%
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="improvement-suggestions">
                        <h5>{t('Improvement Suggestions')}</h5>
                        <ul>
                            {selectedContext.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CulturalContextAnalytics; 