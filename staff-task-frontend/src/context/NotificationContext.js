// frontend/src/context/NotificationContext.js

import React, { createContext, useContext, useState, useMemo } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Add a new notification to the top of the list
    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(), // Simple unique ID
            read: false,
            ...notification, // e.g., { message, type }
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
    };

    // Calculate unread count only when notifications change
    const unreadCount = useMemo(
        () => notifications.filter(n => !n.read).length,
        [notifications]
    );

    const value = { notifications, addNotification, markAllAsRead, unreadCount };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};