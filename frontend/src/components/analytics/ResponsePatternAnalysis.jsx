import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HeatMap } from '@nivo/heatmap';

const ResponsePatternAnalysis = ({ data }) => {
    const { t } = useTranslation();
    const [selectedPattern, setSelectedPattern] = useState(null);

    const heatmapData = data.patterns.map(pattern => ({
        id: pattern.category,
        data: pattern.timeSlots.map(slot => ({
            x: slot.time,
            y: slot.accuracy
        }))
    }));

    return (
        <motion.div
            className="response-pattern-analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="pattern-header">
                <h3>{t('Response Pattern Analysis')}</h3>
                <p>{t('Analysis of bot response patterns across different contexts')}</p>
            </div>

            <div className="pattern-heatmap">
                <div style={{ height: '400px' }}>
                    <HeatMap
                        data={heatmapData}
                        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                        forceSquare={true}
                        axisTop={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -90,
                            legend: t('Time of Day'),
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: t('Response Category'),
                            legendPosition: 'middle',
                            legendOffset: -72
                        }}
                        colors={{
                            type: 'sequential',
                            scheme: 'blues'
                        }}
                        onClick={(node) => setSelectedPattern(data.patterns[node.index])}
                        tooltip={({ xLabel, yLabel, value }) => (
                            <div className="heatmap-tooltip">
                                <strong>{xLabel}</strong>
                                <br />
                                {t('Category')}: {yLabel}
                                <br />
                                {t('Accuracy')}: {value}%
                            </div>
                        )}
                    />
                </div>
            </div>

            <AnimatePresence>
                {selectedPattern && (
                    <motion.div
                        className="pattern-details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="details-header">
                            <h4>{t(selectedPattern.category)}</h4>
                            <button onClick={() => setSelectedPattern(null)}>×</button>
                        </div>

                        <div className="pattern-stats">
                            <div className="stat-item">
                                <span>{t('Average Accuracy')}</span>
                                <strong>{selectedPattern.avgAccuracy}%</strong>
                            </div>
                            <div className="stat-item">
                                <span>{t('Response Time')}</span>
                                <strong>{selectedPattern.avgResponseTime}ms</strong>
                            </div>
                            <div className="stat-item">
                                <span>{t('Cultural Relevance')}</span>
                                <strong>{selectedPattern.culturalRelevance}%</strong>
                            </div>
                        </div>

                        <div className="example-responses">
                            <h5>{t('Example Responses')}</h5>
                            {selectedPattern.examples.map((example, index) => (
                                <motion.div
                                    key={index}
                                    className="example-item"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="query">{example.query}</div>
                                    <div className="response">{example.response}</div>
                                    <div className="context-info">
                                        <span>{t('Context')}: {example.context}</span>
                                        <span>{t('Accuracy')}: {example.accuracy}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResponsePatternAnalysis; 