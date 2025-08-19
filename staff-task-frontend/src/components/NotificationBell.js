// frontend/src/components/NotificationBell.js

import React, { useState, useEffect, useRef } from 'react';
import { HiBell } from 'react-icons/hi';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleBellClick} className="relative text-gray-300 hover:text-white transition-colors">
                <HiBell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="p-3 font-bold border-b border-gray-700">Notifications</div>
                    <ul className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <li key={n.id} className={`p-3 border-b border-gray-700/50 ${!n.read ? 'bg-blue-900/30' : ''}`}>
                                    <p className="text-sm text-gray-200">{n.message}</p>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-sm text-gray-400">No new notifications.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;