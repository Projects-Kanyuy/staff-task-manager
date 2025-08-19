// src/components/UserFormModal.js
import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSave, user, mode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'staff' });
    }
  }, [user, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Create New User' : 'Edit User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg" required />
          </div>
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg">
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;