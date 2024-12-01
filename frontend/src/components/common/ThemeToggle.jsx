import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
    };

    return (
        <div className="theme-toggle">
            <motion.button
                className={`toggle-button ${theme}`}
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div 
                    className="toggle-thumb"
                    layout
                    transition={spring}
                >
                    <motion.span
                        initial={false}
                        animate={{ 
                            rotate: theme === 'dark' ? 360 : 0,
                            scale: theme === 'dark' ? 0.8 : 1
                        }}
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </motion.span>
                </motion.div>
                <div className="toggle-track">
                    <span className="track-icon">🌞</span>
                    <span className="track-icon">🌜</span>
                </div>
            </motion.button>
        </div>
    );
};

export default ThemeToggle; 