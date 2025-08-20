// frontend/src/pages/ProfilePage.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiUser, HiLockClosed } from 'react-icons/hi';

const ProfilePage = () => {
    const { user, login } = useAuth(); // We need login to refresh user state after update

    // State for the profile info form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // State for the password change form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const promise = api.put('/users/profile', profileData);
        toast.promise(promise, {
            loading: 'Updating profile...',
            success: (res) => {
                // To update the user's name in the header, we need to refresh the token/user state.
                // A simple way is to re-trigger the login logic with the old token.
                // A more advanced way would be to create a dedicated setUser function in AuthContext.
                // For now, this is a simple placeholder. A page refresh would also work.
                return 'Profile updated successfully!';
            },
            error: (err) => err.response?.data?.msg || 'Failed to update profile.',
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match.");
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }
        const promise = api.put('/users/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });

        toast.promise(promise, {
            loading: 'Changing password...',
            success: 'Password changed successfully!',
            error: (err) => err.response?.data?.msg || 'Failed to change password.',
        });

        // Clear password fields after submission attempt
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-8">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information Card */}
                <div className="bg-slate-900/50 border border-purple-500/20 p-8 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><HiUser /> Profile Information</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Full Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Email Address</label>
                            <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300">Update Profile</button>
                        </div>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-slate-900/50 border border-purple-500/20 p-8 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><HiLockClosed /> Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Current Password</label>
                            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">New Password</label>
                            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;