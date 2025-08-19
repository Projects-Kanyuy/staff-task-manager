// src/components/TaskItem.js
import React from 'react';

const priorityClasses = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const TaskItem = ({ task, onOpenReportModal }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-50">{task.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priorityClasses[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{task.description}</p>
      </div>
      <div className="flex justify-end items-center pt-4 border-t border-gray-700">
        <button
          onClick={() => onOpenReportModal(task)}
          className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-105 transform transition-transform duration-300"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default TaskItem;