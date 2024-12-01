import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bubble } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const UserEngagementMatrix = ({ data }) => {
    const { t } = useTranslation();
    const [selectedSegment, setSelectedSegment] = useState(null);

    const matrixData = {
        datasets: data.segments.map((segment, index) => ({
            label: segment.name,
            data: [{
                x: segment.frequency,
                y: segment.retention,
                r: segment.userCount / 100 // Scale bubble size
            }],
            backgroundColor: `hsla(${index * 360 / data.segments.length}, 70%, 60%, 0.6)`
        }))
    };

    const matrixOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('Engagement Frequency')
                },
                min: 0,
                max: 10
            },
            y: {
                title: {
                    display: true,
                    text: t('Retention Rate (%)')
                },
                min: 0,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const segment = data.segments[context.datasetIndex];
                        return [
                            `${t('Segment')}: ${segment.name}`,
                            `${t('Users')}: ${segment.userCount}`,
                            `${t('Frequency')}: ${segment.frequency.toFixed(1)}`,
                            `${t('Retention')}: ${segment.retention}%`
                        ];
                    }
                }
            }
        },
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const segmentIndex = elements[0].datasetIndex;
                setSelectedSegment(data.segments[segmentIndex]);
            }
        }
    };

    return (
        <motion.div
            className="user-engagement-matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="matrix-header">
                <h3>{t('User Engagement Matrix')}</h3>
                <p className="matrix-description">
                    {t('Bubble size represents user count in each segment')}
                </p>
            </div>

            <div className="matrix-container">
                <Bubble data={matrixData} options={matrixOptions} />
            </div>

            {selectedSegment && (
                <motion.div
                    className="segment-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>{selectedSegment.name}</h4>
                    <div className="segment-metrics">
                        <div className="metric">
                            <span>{t('Total Users')}</span>
                            <strong>{selectedSegment.userCount}</strong>
                        </div>
                        <div className="metric">
                            <span>{t('Avg. Bet Size')}</span>
                            <strong>{selectedSegment.avgBetSize}</strong>
                        </div>
                        <div className="metric">
                            <span>{t('Win Rate')}</span>
                            <strong>{selectedSegment.winRate}%</strong>
                        </div>
                    </div>
                    <div className="segment-actions">
                        <button className="action-btn">
                            {t('View Details')}
                        </button>
                        <button 
                            className="close-btn"
                            onClick={() => setSelectedSegment(null)}
                        >
                            {t('Close')}
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default UserEngagementMatrix; 