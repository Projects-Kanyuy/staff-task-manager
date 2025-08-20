// frontend/src/pages/ManagerUserPage.js

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';
import api from '../services/api';
import UserFormModal from '../components/UserFormModal';
import { useAuth } from '../context/AuthContext';

const ManagerUserPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // This endpoint fetches only staff users, which is appropriate for managers
      const res = await api.get('/users/staff-only');
      setUsers(res.data);
    } catch (error) {
      toast.error('Could not fetch staff list.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (userToEdit) => {
    setModalMode('edit');
    setCurrentUser(userToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };
  
  const handleSaveUser = async (userData) => {
    // For managers, the role is always 'staff' when creating
    const dataToSave = modalMode === 'create' ? { ...userData, role: 'staff' } : userData;
    if (modalMode === 'edit' && !dataToSave.password) {
      delete dataToSave.password;
    }
    
    try {
      if (modalMode === 'create') {
        await api.post('/users', dataToSave);
        toast.success('Staff user created successfully!');
      } else {
        await api.put(`/users/${currentUser._id}`, dataToSave);
        toast.success('User updated successfully!');
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to save user.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"?`)) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success(`User "${userName}" deleted.`);
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user.');
      }
    }
  };

  if (isLoading) { return <div className="text-center p-8 text-slate-400">Loading staff...</div>; }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-50">Staff Management</h1>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40"
        >
          <HiPlus className="h-5 w-5" /> Add New Staff
        </button>
      </div>
      
      {/* Restored futuristic table container */}
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/30">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((u) => (
              <tr key={u._id} className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-slate-300">{u.email}</td>
                <td className="p-4">
                  <span className="text-accent font-semibold">{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                </td>
                <td className="p-4 flex items-center gap-4">
                  <button onClick={() => openEditModal(u)} className="flex items-center gap-1 text-blue-400 hover:underline text-sm">
                    <HiPencilAlt /> Edit
                  </button>
                  <button onClick={() => handleDeleteUser(u._id, u.name)} className="flex items-center gap-1 text-red-400 hover:underline text-sm">
                    <HiTrash /> Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center p-8 text-slate-400">No staff members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
        mode={modalMode}
        creatorRole={user.role}
      />
    </div>
  );
};

export default ManagerUserPage;