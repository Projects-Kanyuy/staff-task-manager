// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track the initial auth check
  const navigate = useNavigate();

  // This effect runs only once on initial app load to check for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        
        if (isExpired) {
          // Token is expired, clear it
          localStorage.removeItem('token');
        } else {
          // Token is valid, set the user state
          setUser(decodedUser.user);
        }
      } catch (error) {
        console.error("Invalid token on initial load:", error);
        // If token is malformed, clear it
        localStorage.removeItem('token');
      }
    }
    // After the check is complete, set loading to false
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
    
    // Role-based redirection after a successful login
    if (decodedUser.user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (decodedUser.user.role === 'manager') {
      navigate('/manager/tasks');
    } else {
      navigate('/staff-dashboard');
    }
  };

  const register = async (userData) => {
    await api.post('/auth/register', userData);
    navigate('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // The value provided to all consuming components
  const value = { 
    user, 
    login, 
    register, 
    logout, 
    isAuthenticated: !!user, 
    isLoading // Expose the loading state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};