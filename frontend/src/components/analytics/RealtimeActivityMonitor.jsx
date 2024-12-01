import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';

const RealtimeActivityMonitor = () => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [realtimeData, setRealtimeData] = useState({
        activeUsers: [],
        transactions: [],
        activeBets: []
    });

    useEffect(() => {
        socket.on('realtime_update', handleRealtimeUpdate);
        return () => socket.off('realtime_update', handleRealtimeUpdate);
    }, []);

    const handleRealtimeUpdate = (data) => {
        setRealtimeData(prev => ({
            activeUsers: [...prev.activeUsers.slice(-29), data.activeUsers],
            transactions: [...prev.transactions.slice(-29), data.transactions],
            activeBets: [...prev.activeBets.slice(-29), data.activeBets]
        }));
    };

    const chartData = {
        labels: Array(30).fill('').map((_, i) => i === 29 ? 'Now' : `-${30 - i}s`),
        datasets: [
            {
                label: t('Active Users'),
                data: realtimeData.activeUsers,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            },
            {
                label: t('Transactions/s'),
                data: realtimeData.transactions,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            },
            {
                label: t('Active Bets'),
                data: realtimeData.activeBets,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    return (
        <motion.div
            className="realtime-monitor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="monitor-header">
                <h3>{t('Real-time Activity Monitor')}</h3>
                <div className="status-indicators">
                    <StatusIndicator
                        label="System Status"
                        status="healthy"
                        value="Operational"
                    />
                    <StatusIndicator
                        label="Response Time"
                        status={realtimeData.responseTime < 200 ? 'healthy' : 'warning'}
                        value={`${realtimeData.responseTime}ms`}
                    />
                </div>
            </div>
            <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
            </div>
            <ActivityFeed activities={realtimeData.recentActivities} />
        </motion.div>
    );
};

const StatusIndicator = ({ label, status, value }) => (
    <div className={`status-indicator ${status}`}>
        <span className="indicator-label">{label}</span>
        <span className="indicator-value">{value}</span>
        <span className="indicator-dot" />
    </div>
);

const ActivityFeed = ({ activities = [] }) => {
    const { t } = useTranslation();

    return (
        <div className="activity-feed">
            <h4>{t('Recent Activities')}</h4>
            <AnimatePresence>
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        className="activity-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <span className="activity-time">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="activity-type">
                            {activity.type}
                        </span>
                        <span className="activity-description">
                            {activity.description}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default RealtimeActivityMonitor; 