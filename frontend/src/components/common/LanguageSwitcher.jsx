import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'th', name: 'ไทย', flag: '🇹🇭' },
        { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="language-switcher">
            <motion.button
                className="language-button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="flag">{currentLanguage.flag}</span>
                <span className="name">{currentLanguage.name}</span>
                <motion.span
                    className="arrow"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                >
                    ▼
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="language-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {languages.map(language => (
                            <motion.button
                                key={language.code}
                                className={`language-option ${language.code === currentLanguage.code ? 'active' : ''}`}
                                onClick={() => handleLanguageChange(language.code)}
                                whileHover={{ x: 5 }}
                            >
                                <span className="flag">{language.flag}</span>
                                <span className="name">{language.name}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher; 