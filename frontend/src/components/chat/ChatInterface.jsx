import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChannelSelector from './ChannelSelector';

const ChatInterface = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (activeChannel) {
            socket.emit('join_channel', activeChannel.id);
            loadMessages(activeChannel.id);
        }

        return () => {
            if (activeChannel) {
                socket.emit('leave_channel', activeChannel.id);
            }
        };
    }, [activeChannel]);

    const loadMessages = async (channelId) => {
        try {
            const response = await fetch(`/api/chat/${channelId}/messages`);
            const data = await response.json();
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSendMessage = async (content) => {
        try {
            const response = await fetch('/api/chat/message/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: activeChannel.id,
                    content,
                    type: 'text'
                })
            });

            const newMessage = await response.json();
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="chat-interface">
            <div className="chat-sidebar">
                <ChannelSelector
                    onChannelSelect={setActiveChannel}
                    activeChannel={activeChannel}
                />
            </div>
            <div className="chat-main">
                <div className="chat-header">
                    {activeChannel && (
                        <h2>{activeChannel.name}</h2>
                    )}
                </div>
                <MessageList
                    messages={messages}
                    currentUser={user}
                    messagesEndRef={messagesEndRef}
                />
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={!activeChannel}
                />
            </div>
        </div>
    );
};

export default ChatInterface; 