// frontend/src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HiUsers, HiClipboardList, HiDocumentReport, HiExclamationCircle } from 'react-icons/hi';

const StatCard = ({ icon, title, value, color, link }) => (
    <Link 
      to={link} 
      className={`bg-slate-900/50 border border-${color}-500/20 p-6 rounded-xl shadow-lg flex items-center gap-6
                 transition-all duration-300 hover:scale-105 hover:border-${color}-500/50 hover:shadow-lg hover:shadow-${color}-500/20`}
    >
        <div className={`p-3 rounded-full bg-gradient-to-br from-${color}-500 to-${color}-700 shadow-lg shadow-${color}-500/30`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/users/stats');
                setStats(res.data);
            } catch (error) {
                toast.error("Could not load dashboard stats.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="text-center p-8 text-slate-400">Loading dashboard metrics...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    link="/admin/users" 
                    icon={<HiUsers className="h-8 w-8 text-white"/>} 
                    title="Total Users" 
                    value={stats?.totalUsers ?? '...'} 
                    color="purple" 
                />
                <StatCard 
                    link="/admin/tasks?filter=created_today" 
                    icon={<HiClipboardList className="h-8 w-8 text-white"/>} 
                    title="Tasks Created Today" 
                    value={stats?.tasksCreatedToday ?? '...'} 
                    color="blue" 
                />
                <StatCard 
                    link="/admin/reports?filter=submitted_today" 
                    icon={<HiDocumentReport className="h-8 w-8 text-white"/>} 
                    title="Reports Submitted Today" 
                    value={stats?.reportsSubmittedToday ?? '...'} 
                    color="green" 
                />
                <StatCard 
                    link="/admin/tasks?filter=overdue" 
                    icon={<HiExclamationCircle className="h-8 w-8 text-white"/>} 
                    title="Tasks Overdue" 
                    value={stats?.tasksOverdue ?? '...'} 
                    color="red" 
                />
            </div>
        </div>
    );
};

export default AdminDashboard;