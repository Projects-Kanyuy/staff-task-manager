// src/components/TaskFormModal.js
import React, { useState, useEffect } from 'react';

const TaskFormModal = ({ isOpen, onClose, onSave, task, users, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '', // For simplicity, we'll assign to one staff member for now
    dueDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    // If we are in 'edit' mode, populate the form with the task's data
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        dueDate: new Date(task.dueDate).toISOString().substring(0, 10), // Format for date input
        priority: task.priority,
      });
    } else {
      // Reset form for 'create' mode
      setFormData({
        title: '', description: '', assigneeId: '', dueDate: '', priority: 'medium',
      });
    }
  }, [task, mode, isOpen]);

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
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">Assign To</label>
                <select name="assigneeId" value={formData.assigneeId} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Staff</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-105 transform transition-transform">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;