import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const BettingTrendsChart = ({ timeRange = '7d' }) => {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendsData();
    }, [timeRange]);

    const loadTrendsData = async () => {
        try {
            const response = await fetch(`/api/analytics/betting-trends?range=${timeRange}`);
            const trendsData = await response.json();
            setData(formatChartData(trendsData));
        } catch (error) {
            console.error('Error loading betting trends:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = (trendsData) => ({
        labels: trendsData.map(d => d.date),
        datasets: [
            {
                label: t('Total Bets'),
                data: trendsData.map(d => d.totalBets),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
                fill: false
            },
            {
                label: t('Win Rate'),
                data: trendsData.map(d => d.winRate),
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.4,
                fill: false,
                yAxisID: 'percentage'
            }
        ]
    });

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: t('Total Bets')
                }
            },
            percentage: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: t('Win Rate %')
                },
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: false
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label;
                        const value = context.raw;
                        return `${label}: ${context.datasetIndex === 1 ? value.toFixed(1) + '%' : value}`;
                    }
                }
            }
        }
    };

    if (loading) return <div className="loading-spinner" />;

    return (
        <motion.div
            className="betting-trends-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="chart-header">
                <h3>{t('Betting Trends')}</h3>
                <div className="time-range-selector">
                    {['24h', '7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            className={`range-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {t(range)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="chart-container">
                <Line data={data} options={chartOptions} />
            </div>
        </motion.div>
    );
};

export default BettingTrendsChart; 