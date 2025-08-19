// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    // If logged in but not an admin, redirect to a default page (e.g., manager dashboard)
    return <Navigate to="/manager/tasks" />;
  }
  
  // If authenticated and is an admin, render the requested component
  return children;
};

export default AdminRoute;