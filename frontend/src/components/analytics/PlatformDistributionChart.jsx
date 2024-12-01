import React from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const PlatformDistributionChart = ({ data }) => {
    const { t } = useTranslation();

    const chartData = {
        labels: data.map(d => d.platform),
        datasets: [{
            data: data.map(d => d.value),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return chart.data.labels.map((label, i) => ({
                            text: `${label} (${datasets[0].data[i]}%)`,
                            fillStyle: datasets[0].backgroundColor[i],
                            hidden: false,
                            index: i
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    }
                }
            }
        }
    };

    return (
        <motion.div
            className="platform-distribution-chart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h3>{t('Platform Distribution')}</h3>
            <div className="chart-container">
                <Doughnut data={chartData} options={options} />
            </div>
        </motion.div>
    );
};

export default PlatformDistributionChart; 