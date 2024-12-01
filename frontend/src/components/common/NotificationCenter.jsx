import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';

const NotificationCenter = () => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        socket.on('new_notification', handleNewNotification);
        loadNotifications();
        return () => socket.off('new_notification');
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'bet': return '🎲';
            case 'chat': return '💬';
            case 'system': return '⚙️';
            default: return '📢';
        }
    };

    return (
        <div className="notification-center">
            <motion.button
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
            >
                <span className="icon">🔔</span>
                {unreadCount > 0 && (
                    <motion.span
                        className="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notification-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="panel-header">
                            <h3>{t('Notifications')}</h3>
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-read"
                                    onClick={() => notifications.forEach(n => markAsRead(n.id))}
                                >
                                    {t('Mark all as read')}
                                </button>
                            )}
                        </div>

                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="empty-state">
                                    <span className="icon">📭</span>
                                    <p>{t('No notifications')}</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <motion.div
                                        key={notification.id}
                                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <span className="type-icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="content">
                                            <p className="message">{notification.message}</p>
                                            <span className="time">
                                                {new Date(notification.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                className="mark-read"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                ✓
                                            </button>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter; 