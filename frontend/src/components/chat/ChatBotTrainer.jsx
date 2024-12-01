import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { chatBotService } from '../../services/chatBotService';

const ChatBotTrainer = () => {
    const { t } = useTranslation();
    const [trigger, setTrigger] = useState('');
    const [response, setResponse] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTraining(true);

        try {
            await chatBotService.trainQuickResponse(trigger, response);
            setFeedback({
                type: 'success',
                message: t('chatBot.trainingSuccess')
            });
            setTrigger('');
            setResponse('');
        } catch (error) {
            setFeedback({
                type: 'error',
                message: t('chatBot.trainingError')
            });
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="chatbot-trainer">
            <h2>{t('chatBot.training.title')}</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('chatBot.training.triggerLabel')}</label>
                    <input
                        type="text"
                        value={trigger}
                        onChange={(e) => setTrigger(e.target.value)}
                        placeholder={t('chatBot.training.triggerPlaceholder')}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t('chatBot.training.responseLabel')}</label>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder={t('chatBot.training.responsePlaceholder')}
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={isTraining}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isTraining ? (
                        <span className="loading">{t('chatBot.training.processing')}</span>
                    ) : t('chatBot.training.submit')}
                </motion.button>
            </form>

            {feedback && (
                <motion.div
                    className={`feedback ${feedback.type}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {feedback.message}
                </motion.div>
            )}
        </div>
    );
};

export default ChatBotTrainer;