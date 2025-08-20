// frontend/src/components/ChatWidget.js

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { HiChatAlt2, HiPaperAirplane, HiX } from 'react-icons/hi';
import api from '../services/api';

const ChatWidget = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [historyLoaded, setHistoryLoaded] = useState(false); // Flag to prevent re-fetching
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // This effect runs when the chat window is opened
    useEffect(() => {
        if (isOpen && !historyLoaded) {
            const fetchHistory = async () => {
                try {
                    const res = await api.get('/messages');
                    const formattedMessages = res.data.map(msg => ({
                        ...msg,
                        senderName: msg.senderName || 'Unknown',
                        text: msg.text || '',
                    }));
                    setMessages(formattedMessages);
                    setHistoryLoaded(true);
                } catch (error) {
                    console.error("Failed to fetch chat history:", error);
                }
            };
            fetchHistory();
        }
    }, [isOpen, historyLoaded]);

    // This effect listens for new real-time messages
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (message) => {
            // Only add the new message if the history has been loaded
            if (historyLoaded) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => { socket.off('newMessage', handleNewMessage); };
    }, [socket, historyLoaded]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            socket.emit('sendMessage', newMessage.trim());
            setNewMessage('');
        }
    };
    if (!user) return null; // Don't show the widget if not logged in

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* --- REDESIGNED CHAT WINDOW --- */}
            {isOpen && (
                <div className="w-96 bg-slate-900/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl shadow-2xl mb-4 overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-slate-900/80 border-b border-slate-700">
                        <h2 className="font-bold text-slate-50">Global Chat</h2>
                        <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-ghost btn-circle">
                            <HiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Message Display Area */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat ${msg.senderId === user.id ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-header text-xs text-slate-400">
                                    {msg.senderName}
                                </div>
                                <div className={`chat-bubble ${msg.senderId === user.id ? 'chat-bubble-primary text-white' : 'bg-slate-700 text-slate-200'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input Form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white">
                            <HiPaperAirplane className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* --- REDESIGNED FLOATING BUTTON --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="btn btn-circle btn-lg bg-gradient-to-r from-blue-500 to-purple-600 border-none
                           text-white shadow-lg shadow-purple-500/30
                           animate-bounce hover:animate-none transform hover:scale-110 transition-transform"
            >
                <HiChatAlt2 className="h-8 w-8" />
            </button>
        </div>
    );
};

export default ChatWidget;