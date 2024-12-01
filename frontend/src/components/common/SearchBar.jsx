import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ onSearch, suggestions = [], placeholder = 'Search...' }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const inputRef = useRef(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery) {
            onSearch(debouncedQuery);
            const filtered = suggestions.filter(item =>
                item.toLowerCase().includes(debouncedQuery.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    }, [debouncedQuery]);

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setFilteredSuggestions([]);
    };

    return (
        <div className="search-bar">
            <motion.div 
                className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}
                animate={{ scale: isFocused ? 1.02 : 1 }}
            >
                <span className="search-icon">🔍</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={t(placeholder)}
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            className="clear-btn"
                            onClick={handleClear}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ×
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isFocused && filteredSuggestions.length > 0 && (
                    <motion.div
                        className="suggestions-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                    opacity: 1, 
                                    x: 0,
                                    transition: { delay: index * 0.05 }
                                }}
                                whileHover={{ x: 10 }}
                            >
                                <span className="suggestion-icon">🔍</span>
                                <span className="suggestion-text">{suggestion}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar; 