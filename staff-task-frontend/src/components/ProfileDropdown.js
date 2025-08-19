// frontend/src/components/ProfileDropdown.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiUserCircle, HiCog, HiLogout, HiChevronDown } from 'react-icons/hi';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // This effect handles closing the dropdown if you click outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);
    
    // Capitalize the first letter of the role
    const formattedRole = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The main button that is always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-slate-200"
            >
                <HiUserCircle className="h-6 w-6" />
                <span className="font-medium">{user?.name}</span>
                <HiChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* The Dropdown Menu (conditionally rendered) */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-purple-500/20 rounded-lg shadow-lg z-20 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-4 border-b border-slate-700">
                        <p className="text-sm text-slate-400">Signed in as</p>
                        <p className="font-bold text-white">{user?.name}</p>
                        <p className="text-sm text-purple-400">{formattedRole} Role</p>
                    </div>
                    
                    {/* Links Section */}
                    <nav className="py-2">
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors">
                            <HiUserCircle className="h-5 w-5" /> My Profile
                        </Link>
                        <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors">
                            <HiCog className="h-5 w-5" /> App Settings
                        </Link>
                    </nav>

                    {/* Footer Section (Logout) */}
                    <div className="p-2 border-t border-slate-700">
                        <button
                            onClick={logout}
                            className="flex items-center w-full gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                            <HiLogout className="h-5 w-5" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;