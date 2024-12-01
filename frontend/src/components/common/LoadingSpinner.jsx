import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    const sizes = {
        small: '16px',
        medium: '24px',
        large: '32px'
    };

    const colors = {
        primary: 'var(--primary-color)',
        white: 'white',
        secondary: 'var(--text-secondary)'
    };

    return (
        <div 
            className="loading-spinner-container"
            style={{ 
                width: sizes[size], 
                height: sizes[size] 
            }}
        >
            <motion.div
                className="spinner"
                style={{ 
                    borderColor: `${colors[color]}33`,
                    borderTopColor: colors[color]
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default LoadingSpinner; 