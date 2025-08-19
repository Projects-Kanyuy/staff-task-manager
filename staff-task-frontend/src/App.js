// src/App.js 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffHistoryPage from './pages/StaffHistoryPage';
import ManagerTaskPage from './pages/ManagerTaskPage';
import ManagerReportsPage from './pages/ManagerReportsPage';
import AdminUserPage from './pages/AdminUserPage'; 

// Import Components & Layouts
import StaffRoute from './components/StaffRoute';
import ManagerRoute from './components/ManagerRoute';
import MainLayout from './layouts/MainLayout';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    // STEP 1: <Router> must be the top-level parent.
    <Router>
      <Toaster
            position="top-right"
            toastOptions={{
              // Define default options
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Default options for specific types
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
      {/* STEP 2: <AuthProvider> is now a child of <Router>, so it can use navigation hooks. */}
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
           
          
          {/* Protected Staff Routes */}
          <Route path="/staff-dashboard" element={<StaffRoute><MainLayout><StaffDashboard /></MainLayout></StaffRoute>} />
          <Route path="/staff/history" element={<StaffRoute><MainLayout><StaffHistoryPage /></MainLayout></StaffRoute>} />
          
          {/* Protected Manager Routes */}
          <Route path="/manager/tasks" element={<ManagerRoute><MainLayout><ManagerTaskPage /></MainLayout></ManagerRoute>} />
          <Route path="/manager/reports" element={<ManagerRoute><MainLayout><ManagerReportsPage /></MainLayout></ManagerRoute>} />
           {/* Protected Admin Route */}
          <Route path="/admin/users" element={<AdminRoute><MainLayout><AdminUserPage /></MainLayout></AdminRoute>} />
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;