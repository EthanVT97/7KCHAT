import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../hooks/useAlert';

const LoginForm = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData);
            showAlert({
                type: 'success',
                title: t('Welcome back!'),
                message: t('Successfully logged in to your account.')
            });
        } catch (error) {
            showAlert({
                type: 'error',
                title: t('Login Failed'),
                message: error.message || t('Please check your credentials and try again.')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            className="login-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="login-header">
                <motion.div 
                    className="logo"
                    animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1]
                    }}
                    transition={{ duration: 1 }}
                >
                    🎮
                </motion.div>
                <h1>{t('Welcome Back')}</h1>
                <p>{t('Please log in to continue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            username: e.target.value
                        }))}
                        placeholder={t('Username')}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                        placeholder={t('Password')}
                        required
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.remember}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                remember: e.target.checked
                            }))}
                        />
                        <span>{t('Remember me')}</span>
                    </label>
                    <a href="#forgot-password" className="forgot-link">
                        {t('Forgot password?')}
                    </a>
                </div>

                <motion.button
                    type="submit"
                    className="login-btn"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <div className="loading-spinner" />
                    ) : t('Log In')}
                </motion.button>
            </form>

            <div className="login-footer">
                <p>
                    {t("Don't have an account?")}
                    {' '}
                    <a href="#signup">{t('Sign up')}</a>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginForm; 