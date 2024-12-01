import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const FinancialMetricsChart = ({ data }) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState('1M');
    const [chartType, setChartType] = useState('line');

    const timeRanges = {
        '1W': t('1 Week'),
        '1M': t('1 Month'),
        '3M': t('3 Months'),
        '6M': t('6 Months'),
        '1Y': t('1 Year')
    };

    const chartData = {
        labels: data.timeLabels,
        datasets: [
            {
                label: t('Gross Revenue'),
                data: data.grossRevenue,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'revenue'
            },
            {
                label: t('Net Profit'),
                data: data.netProfit,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                yAxisID: 'revenue'
            },
            {
                label: t('Transaction Volume'),
                data: data.transactionVolume,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'volume'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            revenue: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: t('Revenue (MMK)')
                },
                ticks: {
                    callback: (value) => formatCurrency(value)
                }
            },
            volume: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: t('Transaction Volume')
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label;
                        const value = context.raw;
                        return `${label}: ${context.dataset.yAxisID === 'revenue' ? 
                            formatCurrency(value) : value}`;
                    }
                }
            }
        }
    };

    const ChartComponent = chartType === 'line' ? Line : Bar;

    return (
        <motion.div
            className="financial-metrics-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="chart-controls">
                <div className="time-range-selector">
                    {Object.entries(timeRanges).map(([range, label]) => (
                        <button
                            key={range}
                            className={`range-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="chart-type-selector">
                    <button
                        className={`type-btn ${chartType === 'line' ? 'active' : ''}`}
                        onClick={() => setChartType('line')}
                    >
                        {t('Line')}
                    </button>
                    <button
                        className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
                        onClick={() => setChartType('bar')}
                    >
                        {t('Bar')}
                    </button>
                </div>
            </div>

            <div className="chart-container">
                <ChartComponent data={chartData} options={chartOptions} />
            </div>

            <div className="metrics-summary">
                <div className="summary-card">
                    <h4>{t('Revenue Growth')}</h4>
                    <span className={`growth-rate ${data.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                        {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth}%
                    </span>
                </div>
                <div className="summary-card">
                    <h4>{t('Profit Margin')}</h4>
                    <span className="profit-margin">
                        {data.profitMargin}%
                    </span>
                </div>
                <div className="summary-card">
                    <h4>{t('Average Transaction')}</h4>
                    <span className="avg-transaction">
                        {formatCurrency(data.avgTransaction)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default FinancialMetricsChart; 