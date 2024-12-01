import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';

const RealTimeResponse = ({ platform, messageId }) => {
    const { t } = useTranslation();
    const socket = useSocket();
    const responseRef = useRef(null);
    const [responses, setResponses] = React.useState([]);
    const [typing, setTyping] = React.useState({});

    useEffect(() => {
        socket.on(`response_${platform}_${messageId}`, handleResponse);
        socket.on(`typing_${platform}`, handleTyping);

        return () => {
            socket.off(`response_${platform}_${messageId}`);
            socket.off(`typing_${platform}`);
        };
    }, [platform, messageId]);

    const handleResponse = (response) => {
        setResponses(prev => [...prev, response]);
        setTyping(prev => ({ ...prev, [response.sender]: false }));
        scrollToBottom();
    };

    const handleTyping = ({ sender, isTyping }) => {
        setTyping(prev => ({ ...prev, [sender]: isTyping }));
    };

    const scrollToBottom = () => {
        if (responseRef.current) {
            responseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="real-time-response">
            <div className="platform-header">
                <span className="platform-icon">{platform.charAt(0)}</span>
                <span className="platform-name">{platform}</span>
            </div>

            <div className="responses-container" ref={responseRef}>
                <AnimatePresence>
                    {responses.map((response, index) => (
                        <motion.div
                            key={response.id || index}
                            className="response-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="response-header">
                                <span className="sender">{response.sender}</span>
                                <span className="time">
                                    {new Date(response.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="response-content">
                                {response.content}
                            </div>
                            {response.attachments?.length > 0 && (
                                <div className="response-attachments">
                                    {response.attachments.map((attachment, i) => (
                                        <div key={i} className="attachment">
                                            {attachment.type === 'image' ? (
                                                <img src={attachment.url} alt="attachment" />
                                            ) : (
                                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                     {attachment.name}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                <AnimatePresence>
                    {Object.entries(typing).map(([sender, isTyping]) => (
                        isTyping && (
                            <motion.div
                                key={sender}
                                className="typing-indicator"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <span className="sender">{sender}</span>
                                <span className="dots">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </span>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RealTimeResponse; 