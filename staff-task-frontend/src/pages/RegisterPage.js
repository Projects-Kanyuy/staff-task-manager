// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import api from '../services/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4 py-8" style={{ backgroundImage: "radial-gradient(circle at top, #1e293b, #0f172a)"}}>
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-50">Create Account</h2>
            <p className="mt-2 text-sm text-slate-400">Join the team and start tracking your tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-1 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-1 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 mt-1 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
              <option className="bg-slate-800" value="staff">Staff</option>
              <option className="bg-slate-800" value="manager">Manager</option>
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500">
            Register
          </button>
        </form>
         <p className="text-sm text-center text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;