// src/layouts/MainLayout.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navLinkClasses = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
    }`;
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <div className="hidden md:flex items-center gap-4">
              {/* Staff Links */}
              {user?.role === 'staff' && (
                <>
                  <NavLink to="/staff-dashboard" className={navLinkClasses}>Today's Tasks</NavLink>
                  <NavLink to="/staff/history" className={navLinkClasses}>My History</NavLink>
                </>
              )}
              {/* Manager Links */}
              {user?.role === 'manager' && (
                <>
                  <NavLink to="/manager/tasks" className={navLinkClasses}>Task Management</NavLink>
                  <NavLink to="/manager/reports" className={navLinkClasses}>Reports Dashboard</NavLink>
                </>
              )}
              {/* Admin Links */}
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/manager/tasks" className={navLinkClasses}>Task Management</NavLink>
                  <NavLink to="/manager/reports" className={navLinkClasses}>Reports Dashboard</NavLink>
                  <NavLink to="/admin/users" className={navLinkClasses}>User Management</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && <span className="text-gray-400 text-sm hidden sm:block">Welcome, {user.name}</span>}
            <button onClick={logout} className="px-4 py-2 text-sm font-semibold bg-red-600/80 rounded-lg hover:bg-red-600">Logout</button>
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