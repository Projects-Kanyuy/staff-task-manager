// src/App.js 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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
      {/* STEP 2: <AuthProvider> is now a child of <Router>, so it can use navigation hooks. */}
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
}

export default App;