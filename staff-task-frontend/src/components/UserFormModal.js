// frontend/src/components/UserFormModal.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Import the eye icons

const UserFormModal = ({ isOpen, onClose, onSave, user, mode, creatorRole }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'staff' });
    }
    // Reset password visibility when modal opens
    setShowPassword(false);
  }, [user, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-50">{mode === 'create' ? 'Add New User' : 'Edit User'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          
          {/* --- UPDATED PASSWORD FIELD WITH EYE ICON --- */}
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={mode === 'edit' ? "Leave blank to keep current password" : ""}
                required={mode === 'create'}
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
            <select
              name="role" value={formData.role} onChange={handleChange}
              className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={creatorRole === 'manager'}
            >
              <option className="bg-slate-800" value="staff">Staff</option>
              {creatorRole === 'admin' && <option className="bg-slate-800" value="manager">Manager</option>}
              {creatorRole === 'admin' && <option className="bg-slate-800" value="admin">Admin</option>}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;