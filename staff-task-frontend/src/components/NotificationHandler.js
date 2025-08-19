// frontend/src/components/NotificationHandler.js

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiBell } from 'react-icons/hi';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext'; // <-- IMPORT

const NotificationHandler = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const { addNotification } = useNotifications(); // <-- USE THE CONTEXT

    useEffect(() => {
        if (!socket) return;

        const handleNewTask = (data) => {
            const message = `"${data.title}" was assigned by ${data.creatorName}.`;
            // 1. Show the immediate toast
            toast(
                (t) => (
                    <div className="flex gap-3">
                        <HiBell className="text-blue-400 h-6 w-6" />
                        <div><p className="font-bold">New Task Assigned!</p><p className="text-sm">{message}</p></div>
                    </div>
                )
            );
            // 2. Add to the notification list
            addNotification({ message, type: 'task' });
        };
        
        const handleNewReport = (data) => {
            const message = `${data.staffName} submitted a report for "${data.taskTitle}".`;
            // 1. Show the immediate toast
            toast(
                (t) => (
                    <div className="flex gap-3">
                        <HiBell className="text-green-400 h-6 w-6" />
                        <div><p className="font-bold">Report Submitted!</p><p className="text-sm">{message}</p></div>
                    </div>
                )
            );
            // 2. Add to the notification list
            addNotification({ message, type: 'report' });
        };

        if (user?.role === 'staff') socket.on('newTask', handleNewTask);
        if (user?.role === 'manager' || user?.role === 'admin') socket.on('newReport', handleNewReport);

        return () => {
            socket.off('newTask', handleNewTask);
            socket.off('newReport', handleNewReport);
        };
    }, [socket, user, addNotification]);

    return null;
};

export default NotificationHandler;