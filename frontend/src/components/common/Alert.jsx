import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../../hooks/useAlert';

const Alert = () => {
    const { alerts, removeAlert } = useAlert();

    const getAlertIcon = (type) => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '!';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return '•';
        }
    };

    return (
        <div className="alert-container">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        className={`alert-item ${alert.type}`}
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        layout
                    >
                        <div className="alert-icon">
                            {getAlertIcon(alert.type)}
                        </div>
                        <div className="alert-content">
                            {alert.title && (
                                <h4 className="alert-title">{alert.title}</h4>
                            )}
                            <p className="alert-message">{alert.message}</p>
                        </div>
                        <motion.button
                            className="close-btn"
                            onClick={() => removeAlert(alert.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ×
                        </motion.button>
                        <motion.div 
                            className="progress-bar"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: alert.duration || 5 }}
                            onAnimationComplete={() => removeAlert(alert.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Alert; 