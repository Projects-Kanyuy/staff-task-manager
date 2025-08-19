import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TaskItem from '../components/TaskItem';
import SubmitReportModal from '../components/SubmitReportModal';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchMyTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tasks/mytasks');
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const handleReportSubmit = async (reportData) => {
    if (!reportData.screenshot) {
      alert('A screenshot is required to submit a report.');
      return;
    }

    const formData = new FormData();
    formData.append('taskId', selectedTask._id);
    formData.append('status', reportData.status);
    formData.append('notes', reportData.notes);
    formData.append('screenshot', reportData.screenshot);

    try {
      await api.post('/reports', formData);
      alert(`Report for "${selectedTask.title}" submitted successfully!`);
      handleCloseModal();
      // Optionally remove the task from the view or mark it as completed
      setTasks(tasks.filter(task => task._id !== selectedTask._id));
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Error: Could not submit the report.');
    }
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading your tasks...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Today's Tasks</h1>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onOpenReportModal={handleOpenModal} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-800/50 border border-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">All Clear!</h2>
          <p className="text-gray-400">You have no tasks assigned to you right now. Great job!</p>
        </div>
      )}

      {isModalOpen && (
        <SubmitReportModal
          task={selectedTask}
          onClose={handleCloseModal}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default StaffDashboard;