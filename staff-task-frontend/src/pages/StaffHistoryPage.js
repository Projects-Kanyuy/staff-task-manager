// frontend/src/pages/StaffHistoryPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const statusClasses = {
  completed: 'bg-green-500/20 text-green-400',
  partial: 'bg-yellow-500/20 text-yellow-400',
  not_completed: 'bg-red-500/20 text-red-400',
};

const StaffHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/reports/myhistory');
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-400">Loading your submission history...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Submission History</h1>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-x-auto">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-black/30">
              <tr>
                <th className="p-4">Task Title</th>
                <th className="p-4">Date Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-4 font-medium">{item.taskId?.title || 'Task Deleted'}</td>
                  {/* --- THIS IS THE UPDATED LINE --- */}
                  <td className="p-4 text-gray-400">{new Date(item.submittedAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusClasses[item.status]}`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 italic">{item.notes || 'No notes'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-12">
            <h3 className="text-xl font-bold text-white">No History Found</h3>
            <p className="text-gray-400 mt-2">You have no submission history yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffHistoryPage;