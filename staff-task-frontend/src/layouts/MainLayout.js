// frontend/src/layouts/MainLayout.js

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HiChartPie, HiUsers, HiViewGrid, HiDocumentReport, HiClipboardList, HiCollection } from 'react-icons/hi';
import NotificationHandler from '../components/NotificationHandler';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');
  const isManagerView = location.pathname.startsWith('/manager');
  const isStaffView = location.pathname.startsWith('/staff');
  
  const navLinkClasses = ({ isActive }) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20' 
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <NotificationHandler />
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">TaskFlow</h1>
            {isStaffView && (
              <div className="hidden md:flex items-center gap-4">
                <NavLink to="/staff-dashboard" className={navLinkClasses}><HiViewGrid className="h-5 w-5" />Today's Tasks</NavLink>
                <NavLink to="/staff/history" className={navLinkClasses}><HiClipboardList className="h-5 w-5" />My History</NavLink>
                <NavLink to="/directory" className={navLinkClasses}><HiCollection className="h-5 w-5" />Directory</NavLink>
              </div>
            )}
            {isManagerView && (
              <div className="hidden md:flex items-center gap-4">
                <NavLink to="/manager/tasks" className={navLinkClasses}><HiViewGrid className="h-5 w-5" />Task Management</NavLink>
                 <NavLink to="/manager/users" className={navLinkClasses}><HiUsers className="h-5 w-5" />Staff Management</NavLink>
                <NavLink to="/manager/reports" className={navLinkClasses}><HiDocumentReport className="h-5 w-5" />Reports Dashboard</NavLink>
                <NavLink to="/directory" className={navLinkClasses}><HiCollection className="h-5 w-5" />Directory</NavLink>
              </div>
            )}
            {isAdminView && (
              <div className="hidden md:flex items-center gap-4">
                <NavLink to="/admin/dashboard" className={navLinkClasses}><HiChartPie className="h-5 w-5" />Dashboard</NavLink>
                <NavLink to="/admin/users" className={navLinkClasses}><HiUsers className="h-5 w-5" />User Management</NavLink>
                <NavLink to="/admin/tasks" className={navLinkClasses}><HiViewGrid className="h-5 w-5" />All Tasks</NavLink>
                <NavLink to="/admin/reports" className={navLinkClasses}><HiDocumentReport className="h-5 w-5" />All Reports</NavLink>
                <NavLink to="/directory" className={navLinkClasses}><HiCollection className="h-5 w-5" />Directory</NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;