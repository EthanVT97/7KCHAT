import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NotificationCenter from '../common/NotificationCenter';
import UserProfile from '../common/UserProfile';

const Dashboard = ({ children }) => {
    const { t } = useTranslation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('chat');

    const menuItems = [
        { id: 'chat', icon: '💬', label: 'Chat' },
        { id: 'gambling', icon: '🎲', label: 'Gambling' },
        { id: 'analytics', icon: '📊', label: 'Analytics' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ];

    return (
        <div className="dashboard-layout">
            <motion.aside 
                className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
                initial={false}
                animate={{ width: isSidebarOpen ? '240px' : '60px' }}
            >
                <div className="sidebar-header">
                    <motion.div 
                        className="logo"
                        animate={{ scale: isSidebarOpen ? 1 : 0.8 }}
                    >
                        🎮
                    </motion.div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                Seven7k
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button 
                        className="toggle-btn"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <motion.button
                            key={item.id}
                            className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item.id)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="icon">{item.icon}</span>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        className="label"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        {t(item.label)}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <UserProfile compact={!isSidebarOpen} />
                </div>
            </motion.aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h2>{t(menuItems.find(item => item.id === activeMenu)?.label)}</h2>
                    </div>
                    <div className="header-actions">
                        <NotificationCenter />
                        <div className="theme-toggle">
                            {/* Theme toggle component */}
                        </div>
                    </div>
                </header>

                <motion.div 
                    className="dashboard-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard; 