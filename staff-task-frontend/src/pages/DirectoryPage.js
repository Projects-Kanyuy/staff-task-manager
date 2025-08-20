// frontend/src/pages/DirectoryPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Use daisyui badge classes for role-specific colors
const roleClasses = {
    admin: 'badge badge-primary',
    manager: 'badge badge-secondary',
    staff: 'badge badge-accent',
};

const DirectoryPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users/directory');
                setUsers(res.data);
            } catch (error) {
                toast.error("Could not load the user directory.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return <div className="text-center p-8 text-slate-400">Loading directory...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-6">Company Directory</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    // --- THIS IS THE REDESIGNED FUTURISTIC CARD ---
                    <div 
                        key={user._id} 
                        className="bg-slate-900/50 border border-purple-500/20 p-6 rounded-xl shadow-lg
                                   flex flex-col items-center text-center 
                                   transition-all duration-300 hover:border-purple-500/50 hover:scale-105"
                    >
                        {/* Avatar with glowing ring */}
                        <div className="avatar placeholder mb-4">
                            <div className="bg-slate-700 text-slate-200 rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                                <span className="text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>

                        {/* User Details */}
                        <h2 className="text-xl font-bold text-slate-50">{user.name}</h2>
                        <p className="text-slate-400 break-all">{user.email}</p>

                        {/* Role Badge */}
                        <div className={`mt-4 badge ${roleClasses[user.role] || 'badge-ghost'} text-white font-semibold`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DirectoryPage;