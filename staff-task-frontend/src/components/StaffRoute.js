// src/components/StaffRoute.js 
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If a manager tries to access a staff route, send them to their own dashboard
  if (user.role === 'manager' || user.role === 'admin') {
    return <Navigate to="/manager/tasks" />;
  }

  return children;
};

export default StaffRoute;