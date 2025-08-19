// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // <-- Import the icons

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  
  // --- ADD THIS STATE ---
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  if (isAuthenticated) {
    const targetDashboard = user.role === 'manager' || user.role === 'admin' ? '/manager/tasks' : '/staff-dashboard';
    return <Navigate to={targetDashboard} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-50">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              required
            />
          </div>
          
          {/* --- THIS IS THE UPDATED PASSWORD FIELD --- */}
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'} // Dynamically change type
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                required
              />
              <button
                type="button" // Important to prevent form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;