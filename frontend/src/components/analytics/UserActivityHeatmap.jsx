import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const UserActivityHeatmap = ({ data }) => {
    const { t } = useTranslation();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getIntensityColor = (value) => {
        const maxValue = Math.max(...data.flat());
        const intensity = value / maxValue;
        return `rgba(75, 192, 192, ${intensity})`;
    };

    return (
        <motion.div
            className="user-activity-heatmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h3>{t('User Activity Heatmap')}</h3>
            <div className="heatmap-container">
                <div className="hour-labels">
                    {hours.map(hour => (
                        <div key={hour} className="hour-label">
                            {hour}:00
                        </div>
                    ))}
                </div>
                <div className="heatmap-grid">
                    {days.map((day, dayIndex) => (
                        <div key={day} className="day-row">
                            <div className="day-label">{t(day)}</div>
                            {hours.map(hour => (
                                <motion.div
                                    key={`${day}-${hour}`}
                                    className="heatmap-cell"
                                    style={{
                                        backgroundColor: getIntensityColor(data[dayIndex][hour])
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: (dayIndex * 24 + hour) * 0.001 }}
                                    whileHover={{
                                        scale: 1.2,
                                        zIndex: 1
                                    }}
                                >
                                    <div className="cell-tooltip">
                                        {t('Users')}: {data[dayIndex][hour]}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserActivityHeatmap; 