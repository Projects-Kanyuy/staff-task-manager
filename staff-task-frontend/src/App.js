// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffHistoryPage from './pages/StaffHistoryPage';
import ManagerTaskPage from './pages/ManagerTaskPage';
import ManagerReportsPage from './pages/ManagerReportsPage';
import ManagerUserPage from './pages/ManagerUserPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DirectoryPage from './pages/DirectoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserPage from './pages/AdminUserPage';
import AdminTaskPage from './pages/AdminTaskPage';
import AdminReportsPage from './pages/AdminReportsPage';

// Import Layouts and Route Protectors
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORT GENERIC PROTECTOR
import StaffRoute from './components/StaffRoute';
import ManagerRoute from './components/ManagerRoute';
import AdminRoute from './components/AdminRoute';
import ChatWidget from './components/ChatWidget';

const AppProviders = () => (
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
          <Outlet />
          <ChatWidget />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppProviders />}>
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* --- THESE ROUTES ARE NOW CORRECTLY PROTECTED --- */}
          <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
          <Route path="/directory" element={<ProtectedRoute><MainLayout><DirectoryPage /></MainLayout></ProtectedRoute>} />
          
          {/* Role-Specific Protected Routes */}
          <Route path="/staff-dashboard" element={<StaffRoute><MainLayout><StaffDashboard /></MainLayout></StaffRoute>} />
          <Route path="/staff/history" element={<StaffRoute><MainLayout><StaffHistoryPage /></MainLayout></StaffRoute>} />
          
          <Route path="/manager/tasks" element={<ManagerRoute><MainLayout><ManagerTaskPage /></MainLayout></ManagerRoute>} />
          <Route path="/manager/users" element={<ManagerRoute><MainLayout><ManagerUserPage /></MainLayout></ManagerRoute>} />
          <Route path="/manager/reports" element={<ManagerRoute><MainLayout><ManagerReportsPage /></MainLayout></ManagerRoute>} />
          
          <Route path="/admin/dashboard" element={<AdminRoute><MainLayout><AdminDashboard/></MainLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><MainLayout><AdminUserPage /></MainLayout></AdminRoute>} />
          <Route path="/admin/tasks" element={<AdminRoute><MainLayout><AdminTaskPage /></MainLayout></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><MainLayout><AdminReportsPage /></MainLayout></AdminRoute>} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;