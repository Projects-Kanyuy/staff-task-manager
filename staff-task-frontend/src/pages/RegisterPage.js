import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import new icons

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password, role });
    } catch (err) {
      setError('Registration failed. The email might already be in use.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-50">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join the team and start tracking your tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-200 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-200 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-200 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors">
              {/* Conditionally render the correct icon */}
              {showPassword ? <AiFillEyeInvisible className="text-2xl" /> : <AiFillEye className="text-2xl" />}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option className="bg-gray-800" value="staff">Staff</option>
              <option className="bg-gray-800" value="manager">Manager</option>
            </select>
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;