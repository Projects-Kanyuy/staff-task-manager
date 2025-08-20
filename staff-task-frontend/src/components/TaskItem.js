// frontend/src/components/TaskItem.js

import React from 'react';
import { HiOutlineClock } from 'react-icons/hi';

// The original, custom priority badge styles
const priorityClasses = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const TaskItem = ({ task, onOpenReportModal }) => {
  return (
    // Restored the original futuristic card style with frosted glass and glowing hover effect
    <div className="bg-slate-900/50 border border-purple-500/20 p-5 rounded-xl shadow-lg flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-colors duration-300">
      <div>
        {/* Header section with title and priority badge */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-50">{task.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priorityClasses[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm">{task.description}</p>
        
        {/* Time Interval Display */}
        {task.startTime && task.endTime && (
          <div className="flex items-center gap-2 mt-2 text-sm text-purple-400">
            <HiOutlineClock className="h-5 w-5" />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
        )}
      </div>
      
      {/* Footer section with the action button */}
      <div className="flex justify-end items-center pt-4 border-t border-slate-700">
        {/* Restored the custom gradient button with correct disabled states */}
        <button
          onClick={() => onOpenReportModal(task)}
          disabled={task.hasSubmittedToday}
          className="px-4 py-2 font-semibold text-white rounded-lg transition-all duration-300
                     bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transform
                     shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40
                     disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
          {task.hasSubmittedToday ? 'Submitted' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;