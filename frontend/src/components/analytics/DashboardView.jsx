import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import MetricsCard from '../common/MetricsCard';
import ChannelStats from './ChannelStats';
import { formatNumber } from '../../utils/numberFormat';

const DashboardView = () => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [metrics, setMetrics] = useState({
        conversations: [],
        channelStats: {},
        userMetrics: {},
        realtimeUsers: 0
    });

    useEffect(() => {
        loadDashboardData();
        socket.on('metrics_update', handleMetricsUpdate);

        return () => {
            socket.off('metrics_update', handleMetricsUpdate);
        };
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const handleMetricsUpdate = (data) => {
        setMetrics(prev => ({
            ...prev,
            ...data
        }));
    };

    return (
        <div className="dashboard-container">
            <div className="metrics-grid">
                <MetricsCard
                    title={t('Active Users')}
                    value={formatNumber(metrics.realtimeUsers)}
                    trend={metrics.userTrend}
                    icon="users"
                />
                <MetricsCard
                    title={t('Total Conversations')}
                    value={formatNumber(metrics.conversations.length)}
                    trend={metrics.conversationTrend}
                    icon="chat"
                />
                <MetricsCard
                    title={t('Response Rate')}
                    value={`${metrics.responseRate}%`}
                    trend={metrics.responseRateTrend}
                    icon="chart"
                />
            </div>

            <div className="chart-grid">
                <div className="chart-container">
                    <h3>{t('Conversation Trends')}</h3>
                    <Line
                        data={getConversationChartData()}
                        options={chartOptions.line}
                    />
                </div>
                <div className="chart-container">
                    <h3>{t('Channel Distribution')}</h3>
                    <Pie
                        data={getChannelDistributionData()}
                        options={chartOptions.pie}
                    />
                </div>
            </div>

            <ChannelStats stats={metrics.channelStats} />
        </div>
    );
};

const chartOptions = {
    line: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
    pie: {
        responsive: true,
        maintainAspectRatio: false
    }
};

export default DashboardView; 