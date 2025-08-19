// frontend/src/components/TaskFormModal.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TaskFormModal = ({ isOpen, onClose, onSave, task, users, mode, isStaffMode = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'medium' });

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeIds[0]?._id || '', // Handle single assignee
        dueDate: new Date(task.dueDate).toISOString().substring(0, 10),
        priority: task.priority,
      });
    } else {
      setFormData({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'medium' });
    }
  }, [task, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, assigneeIds: [formData.assigneeId] }); // Ensure assigneeIds is an array
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-50">{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isStaffMode ? (
              <div>
                <label className="block text-sm font-medium text-slate-300">Assign To</label>
                <div className="w-full mt-1 px-4 py-2 text-slate-400 bg-slate-800/20 border border-slate-700/50 rounded-lg">{user ? user.name : 'Loading...'}</div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300">Assign To</label>
                <select name="assigneeId" value={formData.assigneeId} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select Staff</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;