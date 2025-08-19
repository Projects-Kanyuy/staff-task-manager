// frontend/src/pages/ManagerTaskPage.js

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';
import TaskFormModal from '../components/TaskFormModal';
import api from '../services/api';

const priorityClasses = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
};

const ManagerTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentTask, setCurrentTask] = useState(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const tasksResponse = await api.get('/tasks');
      setTasks(tasksResponse.data.data);
      const usersResponse = await api.get('/tasks/staff');
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Could not load page data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode('edit');
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (modalMode === 'create') {
        await api.post('/tasks', taskData);
        toast.success('Task created successfully!');
      } else {
        await api.put(`/tasks/${currentTask._id}`, taskData);
        toast.success('Task updated successfully!');
      }
      fetchAllData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error("Error: Could not save the task.");
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        toast.success('Task has been deleted.');
        fetchAllData();
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("Error: Could not delete the task.");
      }
    }
  };

 
  if (isLoading) { return <div className="text-center p-8 text-slate-400">Loading tasks and users...</div>; }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-50">Task Management</h1>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">
          <HiPlus className="h-5 w-5" /> Create New Task
        </button>
      </div>
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/30">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Date Created</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium">{task.title}</td>
                <td className="p-4 text-slate-300">{task.assigneeIds.map(a => a.name).join(', ') || 'Unassigned'}</td>
                <td className="p-4 text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-slate-300">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityClasses[task.priority]}`}>{task.priority.toUpperCase()}</span></td>
                <td className="p-4 flex items-center gap-4">
                  <button onClick={() => openEditModal(task)} disabled={task.hasBeenReported} className="flex items-center gap-1 text-blue-400 hover:underline text-sm disabled:text-slate-500 disabled:cursor-not-allowed disabled:no-underline" title={task.hasBeenReported ? "Cannot edit a task with submitted reports" : "Edit task"}>
                    <HiPencilAlt /> Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} disabled={task.hasBeenReported} className="flex items-center gap-1 text-red-400 hover:underline text-sm disabled:text-slate-500 disabled:cursor-not-allowed disabled:no-underline" title={task.hasBeenReported ? "Cannot delete a task with submitted reports" : "Delete task"}>
                    <HiTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TaskFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} task={currentTask} users={users} mode={modalMode} />
    </div>
  );
};

export default ManagerTaskPage;