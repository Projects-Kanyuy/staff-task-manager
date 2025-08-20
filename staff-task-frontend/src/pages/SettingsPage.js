// frontend/src/pages/SettingsPage.js

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

// This is a local component specifically for this page
const ThemeCard = ({ themeName, currentTheme, setTheme, icon, label }) => (
    // The onClick handler is placed on this div
    <div
        onClick={() => setTheme(themeName)}
        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300
                    ${currentTheme === themeName 
                        ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                        : 'border-base-300 hover:border-primary/50'}`}
    >
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-bold text-lg">{label}</span>
        </div>
        <p className="text-sm text-base-content/60 mt-2">
            Click to apply the {label.toLowerCase()} theme.
        </p>
    </div>
);

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">App Settings</h1>
            
            <div className="bg-base-200 p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Display Theme</h2>
                <p className="mb-6 text-base-content/70">
                    Choose how TaskFlow looks and feels. Your preference will be saved for your next visit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ThemeCard
                        themeName="professional"
                        currentTheme={theme}
                        setTheme={setTheme}
                        icon={<HiSun className="h-8 w-8 text-yellow-500" />}
                        label="Professional (Light)"
                    />
                    <ThemeCard
                        themeName="futuristic"
                        currentTheme={theme}
                        setTheme={setTheme}
                        icon={<HiMoon className="h-8 w-8 text-purple-500" />}
                        label="Futuristic (Dark)"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;