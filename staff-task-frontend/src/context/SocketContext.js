// frontend/src/context/SocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Only attempt to connect if the user is authenticated
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            
            // Create the socket instance
            const newSocket = io('http://localhost:5000', {
                auth: { token }
            });

            setSocket(newSocket);

            // CLEANUP FUNCTION:
            // React runs this automatically when the component unmounts
            // OR when 'isAuthenticated' changes (e.g., user logs out).
            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [isAuthenticated]); // Only 'isAuthenticated' is needed here now

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};