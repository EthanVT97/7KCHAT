import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const WelcomeScreen = () => {
    const { t, i18n } = useTranslation();

    const getLanguageSpecificStyles = () => {
        switch (i18n.language) {
            case 'my':
                return {
                    fontFamily: 'Pyidaungsu, sans-serif',
                    titleSize: '2.5rem',
                    lineHeight: '1.6'
                };
            case 'th':
                return {
                    fontFamily: 'Prompt, sans-serif',
                    titleSize: '2.2rem',
                    lineHeight: '1.5'
                };
            default:
                return {
                    fontFamily: 'SF Pro Display, sans-serif',
                    titleSize: '2rem',
                    lineHeight: '1.4'
                };
        }
    };

    const styles = getLanguageSpecificStyles();

    return (
        <div className="welcome-screen" style={{ fontFamily: styles.fontFamily }}>
            <div className="language-selector">
                <LanguageSwitcher />
            </div>

            <motion.div 
                className="welcome-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.h1 
                    style={{ fontSize: styles.titleSize, lineHeight: styles.lineHeight }}
                    className="welcome-title"
                >
                    {t('welcome.title')}
                </motion.h1>
                <p className="welcome-subtitle">{t('welcome.subtitle')}</p>

                <div className="platform-grid">
                    {['TheLordMM', 'TJ89', '9Plus'].map((platform) => (
                        <motion.div
                            key={platform}
                            className="platform-card"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="platform-icon">
                                {t(`platforms.${platform}.icon`)}
                            </div>
                            <h3>{t(`platforms.${platform}.name`)}</h3>
                            <p>{t(`platforms.${platform}.description`)}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="game-categories">
                    <h2>{t('categories.title')}</h2>
                    <div className="category-grid">
                        {['2D', '3D', 'football', 'casino'].map((category) => (
                            <motion.div
                                key={category}
                                className="category-card"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="category-icon">
                                    {t(`categories.${category}.icon`)}
                                </div>
                                <h4>{t(`categories.${category}.name`)}</h4>
                                <span className="odds">
                                    {t('common.odds')}: {t(`categories.${category}.odds`)}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen; 