// frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // This check is important for the initial page load.
  // While the AuthContext is still figuring out if a user is logged in
  // (by checking localStorage), we can show a loading state.
  if (isLoading) {
    // Or return a spinner/loading component
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If the user is not authenticated, redirect them to the login page.
  // We also pass the current location in the state, so after logging in,
  // they can be redirected back to the page they were trying to access.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child components (the actual page).
  return children;
};

export default ProtectedRoute;