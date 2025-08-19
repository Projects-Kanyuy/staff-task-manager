// src/components/ManagerRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManagerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.role !== 'manager' && user.role !== 'admin') {
    // Logged in but not a manager, redirect to staff dashboard
    return <Navigate to="/staff-dashboard" />;
  }
  
  // If authenticated and has the correct role, render the component
  return children;
};

export default ManagerRoute;