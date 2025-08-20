// frontend/src/pages/StaffDashboard.js

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiPlus, HiCheckCircle } from 'react-icons/hi';
import TaskItem from '../components/TaskItem';
import SubmitReportModal from '../components/SubmitReportModal';
import TaskFormModal from '../components/TaskFormModal';
import api from '../services/api';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/tasks/mytasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Could not load your tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenReportModal = (task) => {
    setSelectedTask(task);
    setIsReportModalOpen(true);
  };
  const handleCloseReportModal = () => setIsReportModalOpen(false);
  const handleOpenTaskModal = () => setIsTaskModalOpen(true);
  const handleCloseTaskModal = () => setIsTaskModalOpen(false);

const handleReportSubmit = async (reportData) => {
    if (!selectedTask) return;

    const formData = new FormData();
    formData.append('taskId', selectedTask._id);
    formData.append('status', reportData.status);
    formData.append('notes', reportData.notes);
    
    // --- ADD THE WORK LINK TO THE FORM DATA ---
    if (reportData.workLink) {
      formData.append('workLink', reportData.workLink);
    }
    
    if (reportData.screenshot) {
      formData.append('screenshot', reportData.screenshot);
    } else {
      // The backend now requires a screenshot
      return toast.error("A screenshot is required to submit a report.");
    }

    try {
      await api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`Report for "${selectedTask.title}" submitted!`);
      handleCloseReportModal();
      fetchTasks();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Could not submit the report.';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      toast.success('Task created successfully!');
      fetchTasks();
      handleCloseTaskModal();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Error: Could not create the task.");
    }
  };

  if (isLoading) { return <div className="text-center p-8 text-slate-400">Loading your tasks...</div>; }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-50">Today's Tasks</h1>
        <button onClick={handleOpenTaskModal} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">
          <HiPlus className="h-5 w-5" /> Create Task
        </button>
      </div>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => <TaskItem key={task._id} task={task} onOpenReportModal={handleOpenReportModal} />)}
        </div>
      ) : (
        <div className="text-center bg-slate-900/50 border-2 border-dashed border-slate-700 p-12 rounded-xl flex flex-col items-center">
          <HiCheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-white">All Clear!</h3>
          <p className="text-slate-400 mt-2 mb-6">You have no tasks assigned to you right now. Great job!</p>
          <button onClick={handleOpenTaskModal} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">
            <HiPlus className="h-5 w-5" /> Add Your First Task
          </button>
        </div>
      )}
      {isReportModalOpen && <SubmitReportModal task={selectedTask} onClose={handleCloseReportModal} onSubmit={handleReportSubmit} />}
      <TaskFormModal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} onSave={handleSaveTask} mode="create" isStaffMode={true} users={[]} />
    </div>
  );
};

export default StaffDashboard;