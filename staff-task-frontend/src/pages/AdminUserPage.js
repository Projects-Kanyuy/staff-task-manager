// src/pages/AdminUserPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import UserFormModal from '../components/UserFormModal';

const roleClasses = {
  admin: 'bg-purple-500/20 text-purple-400',
  manager: 'bg-blue-500/20 text-blue-400',
  staff: 'bg-gray-500/20 text-gray-400',
};

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === 'create') {
        await api.post('/users', userData);
      } else {
        await api.put(`/users/${currentUser._id}`, userData);
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || 'Could not save user'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Error: Could not delete user.');
      }
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button onClick={openCreateModal} className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Create New User
        </button>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
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
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleClasses[user.role]}`}>{user.role.toUpperCase()}</span></td>
                <td className="p-4 space-x-2">
                  <button onClick={() => openEditModal(user)} className="text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminUserPage;