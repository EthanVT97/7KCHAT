import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';

const MultiChannelForm = ({ onSend, platforms = ['TheLordMM', 'TJ89', '9Plus'] }) => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [message, setMessage] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !attachments.length) return;

        try {
            await onSend({
                content: message,
                platforms: selectedPlatforms,
                attachments,
                type: attachments.length ? 'media' : 'text'
            });

            setMessage('');
            setAttachments([]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing_start', { platforms: selectedPlatforms });

            setTimeout(() => {
                setIsTyping(false);
                socket.emit('typing_end', { platforms: selectedPlatforms });
            }, 2000);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'file'
        }));

        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => {
            const newAttachments = [...prev];
            URL.revokeObjectURL(newAttachments[index].preview);
            newAttachments.splice(index, 1);
            return newAttachments;
        });
    };

    return (
        <div className="multi-channel-form">
            <div className="platform-selector">
                {platforms.map(platform => (
                    <motion.button
                        key={platform}
                        className={`platform-btn ${selectedPlatforms.includes(platform) ? 'active' : ''}`}
                        onClick={() => handlePlatformToggle(platform)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="platform-icon">{platform.charAt(0)}</span>
                        <span className="platform-name">{platform}</span>
                    </motion.button>
                ))}
            </div>

            {attachments.length > 0 && (
                <div className="attachments-preview">
                    {attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                            {attachment.type === 'image' ? (
                                <img src={attachment.preview} alt="attachment" />
                            ) : (
                                <div className="file-preview">
                                    <i className="file-icon">📄</i>
                                    <span>{attachment.file.name}</span>
                                </div>
                            )}
                            <button 
                                className="remove-btn"
                                onClick={() => removeAttachment(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="message-form">
                <div className="input-group">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        onInput={handleTyping}
                        placeholder={t('Type your message...')}
                        rows={3}
                    />
                    <div className="form-actions">
                        <label className="attach-btn">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                accept="image/*,.pdf,.doc,.docx"
                                hidden
                            />
                            📎
                        </label>
                        <button 
                            type="submit"
                            disabled={!message.trim() && !attachments.length || !selectedPlatforms.length}
                            className="send-btn"
                        >
                            {t('Send')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MultiChannelForm; 