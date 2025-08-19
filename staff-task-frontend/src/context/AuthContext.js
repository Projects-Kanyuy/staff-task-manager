import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // On initial app load, check for an existing token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          console.log("Token expired, logging out.");
          logout();
        } else {
          setUser(decodedUser.user);
        }
      } catch (error) {
        console.error("Invalid token found in storage:", error);
        logout(); // Clear the invalid token
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
    
    // Redirect based on the user's role
    if (decodedUser.user.role === 'manager' || decodedUser.user.role === 'admin') {
      navigate('/manager/tasks');
    } else {
      navigate('/staff-dashboard');
    }
  };

  const register = async (userData) => {
    await api.post('/auth/register', userData);
    alert('Registration successful! Please log in.');
    navigate('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, register, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};