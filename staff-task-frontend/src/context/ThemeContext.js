// frontend/src/context/ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Initialize state from localStorage or default to 'futuristic'
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'futuristic');

    // This effect applies the theme to the root HTML element whenever the theme state changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const value = { theme, setTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};