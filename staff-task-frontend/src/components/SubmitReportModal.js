// src/components/SubmitReportModal.js
import React, { useState } from 'react';

const SubmitReportModal = ({ task, onClose, onSubmit }) => {
  const [status, setStatus] = useState('completed');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  if (!task) return null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be a FormData object
    const reportData = {
      status,
      notes,
      screenshot,
    };
    onSubmit(reportData);
    onClose(); // Close modal after submission
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-2">Submit Report for:</h2>
        <p className="text-blue-400 font-semibold mb-6">{task.title}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
              <option value="not_completed">Not Completed</option>
            </select>
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any relevant notes here..."
            />
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Upload Screenshot</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <div className="flex text-sm text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-blue-500"><span className="px-1">Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/></label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">{screenshot ? screenshot.name : 'PNG, JPG, WEBP up to 10MB'}</p>
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-105 transform transition-transform"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReportModal;