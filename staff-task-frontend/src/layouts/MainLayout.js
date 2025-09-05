// frontend/src/layouts/MainLayout.js

import React, { useState } from 'react'; // Import useState
import { NavLink, useLocation } from 'react-router-dom';
import { 
    HiChartPie, 
    HiUsers, 
    HiViewGrid, 
    HiDocumentReport, 
    HiClipboardList, 
    HiCollection,
    HiMenu, // <-- Import Hamburger Icon
    HiX     // <-- Import Close Icon
} from 'react-icons/hi';
import NotificationHandler from '../components/NotificationHandler';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');
  const isManagerView = location.pathname.startsWith('/manager');
  const isStaffView = location.pathname.startsWith('/staff');
  
  // Your original navLinkClasses function - unchanged
  const navLinkClasses = ({ isActive }) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20' 
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;
    
  // A version of your navLinkClasses for the larger text in the sidebar
  const sidebarNavLinkClasses = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-2 rounded-lg text-lg transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20' 
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;

  // Reusable component to hold your navigation links, to avoid repetition
  const NavigationLinks = ({ linkClasses, onLinkClick }) => (
    <>
      {isStaffView && (
        <>
          <NavLink to="/staff-dashboard" className={linkClasses} onClick={onLinkClick}><HiViewGrid className="h-5 w-5" />Today's Tasks</NavLink>
          <NavLink to="/staff/history" className={linkClasses} onClick={onLinkClick}><HiClipboardList className="h-5 w-5" />My History</NavLink>
          <NavLink to="/directory" className={linkClasses} onClick={onLinkClick}><HiCollection className="h-5 w-5" />Directory</NavLink>
        </>
      )}
      {isManagerView && (
        <>
          <NavLink to="/manager/tasks" className={linkClasses} onClick={onLinkClick}><HiViewGrid className="h-5 w-5" />Task Management</NavLink>
          <NavLink to="/manager/users" className={linkClasses} onClick={onLinkClick}><HiUsers className="h-5 w-5" />Staff Management</NavLink>
          <NavLink to="/manager/reports" className={linkClasses} onClick={onLinkClick}><HiDocumentReport className="h-5 w-5" />Reports Dashboard</NavLink>
          <NavLink to="/directory" className={linkClasses} onClick={onLinkClick}><HiCollection className="h-5 w-5" />Directory</NavLink>
        </>
      )}
      {isAdminView && (
        <>
          <NavLink to="/admin/dashboard" className={linkClasses} onClick={onLinkClick}><HiChartPie className="h-5 w-5" />Dashboard</NavLink>
          <NavLink to="/admin/users" className={linkClasses} onClick={onLinkClick}><HiUsers className="h-5 w-5" />User Management</NavLink>
          <NavLink to="/admin/tasks" className={linkClasses} onClick={onLinkClick}><HiViewGrid className="h-5 w-5" />All Tasks</NavLink>
          <NavLink to="/admin/reports" className={linkClasses} onClick={onLinkClick}><HiDocumentReport className="h-5 w-5" />All Reports</NavLink>
          <NavLink to="/directory" className={linkClasses} onClick={onLinkClick}><HiCollection className="h-5 w-5" />Directory</NavLink>
        </>
      )}
    </>
  );

  return (
    // Your original main div - unchanged
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <NotificationHandler />

      {/* --- ADDED MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className={`relative flex flex-col w-72 h-full bg-slate-900 shadow-xl border-r border-purple-500/20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50"><HiX className="h-6 w-6" /></button>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            <NavigationLinks linkClasses={sidebarNavLinkClasses} onLinkClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>
      </div>

      {/* Your original header - with added responsive classes */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
        <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button - Shows only on small screens */}
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-300 hover:text-white">
              <HiMenu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">TaskFlow</h1>
            {/* Desktop Navigation - Hides on small screens */}
            <div className="hidden md:flex items-center gap-4">
              <NavigationLinks linkClasses={navLinkClasses} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </nav>
      </header>

      {/* Your original main content area - unchanged */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;