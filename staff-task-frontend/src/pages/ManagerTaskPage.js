import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TaskFormModal from '../components/TaskFormModal';

const priorityClasses = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
};

const ManagerTaskPage = () => {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentTask, setCurrentTask] = useState(null);

  // Updated function to fetch tasks for a specific page
  const fetchTasks = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/tasks?page=${page}&limit=10`);
      setTasks(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetches the list of staff users for the dropdown
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/staff/users');
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  // Fetch tasks whenever the currentPage changes
  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  // Fetch users only once on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveTask = async (taskData) => {
    try {
      if (modalMode === 'create') {
        await api.post('/tasks', { ...taskData, assigneeIds: [taskData.assigneeId] });
      } else {
        await api.put(`/tasks/${currentTask._id}`, { ...taskData, assigneeIds: [taskData.assigneeId] });
      }
      fetchTasks(currentPage); // Re-fetch the current page to show changes
      setIsModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || 'Could not save the task.'}`);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks(currentPage); // Re-fetch to reflect deletion
      } catch (error) {
        alert("Error: Could not delete the task.");
      }
    }
  };
  
  const getAssigneeName = (assigneeIds) => {
      if (!assigneeIds || assigneeIds.length === 0) return 'Unassigned';
      return assigneeIds.map(a => a.name).join(', ');
  }

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
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <button onClick={openCreateModal} className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-105 transform transition-transform duration-300">
          Create New Task
        </button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/30">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-4 font-medium">{task.title}</td>
                <td className="p-4 text-gray-300">{getAssigneeName(task.assigneeIds)}</td>
                <td className="p-4 text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityClasses[task.priority]}`}>{task.priority.toUpperCase()}</span></td>
                <td className="p-4 space-x-2">
                  <button onClick={() => openEditModal(task)} className="text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW: Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || totalPages === 0}
          className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-400">
          Page {totalPages > 0 ? currentPage : 0} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>

      <TaskFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        users={users.map(u => ({ id: u._id, name: u.name }))}
        mode={modalMode}
      />
    </div>
  );
};

export default ManagerTaskPage;