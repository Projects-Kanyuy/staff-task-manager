// frontend/src/components/SubmitReportModal.js

import React, { useState } from 'react';

const SubmitReportModal = ({ task, onClose, onSubmit }) => {
  const [status, setStatus] = useState('completed');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [workLink, setWorkLink] = useState('');

  if (!task) return null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, notes, screenshot, workLink });
  };

  return (
    // Frosted glass background overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* The main modal card with the restored futuristic design */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <h2 className="text-2xl font-bold mb-2 text-slate-50">Submit Report for:</h2>
        <p className="text-purple-400 font-semibold mb-6">{task.title}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option className="bg-slate-800" value="completed">Completed</option>
              <option className="bg-slate-800" value="partial">Partial</option>
              <option className="bg-slate-800" value="not_completed">Not Completed</option>
            </select>
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add any relevant notes here..."
            />
          </div>
          
          {/* Work Link Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Work Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://example.com/proof-of-work"
              value={workLink} 
              onChange={(e) => setWorkLink(e.target.value)} 
              className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Upload Screenshot (Required)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <div className="flex text-sm text-slate-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-blue-500"><span className="px-1">Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" required/></label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">{screenshot ? screenshot.name : 'PNG, JPG, WEBP up to 10MB'}</p>
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReportModal;