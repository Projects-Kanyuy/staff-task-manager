// frontend/src/components/ReportCard.js

import React from 'react';
import { HiExternalLink } from 'react-icons/hi';

const statusClasses = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  partial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  not_completed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ReportCard = ({ report, onImageClick }) => {
  return (
    // Restored the original futuristic card style
    <div className="bg-slate-900/50 border border-purple-500/20 p-5 rounded-xl shadow-lg flex flex-col space-y-4 hover:border-purple-500/50 transition-colors duration-300">
      {/* Header section with title, staff name, and status */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-50">{report.taskId?.title || 'Task Deleted'}</h3>
          <p className="text-sm text-slate-400">by <span className="font-semibold">{report.staffId?.name || 'User Deleted'}</span> on {new Date(report.submittedAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusClasses[report.status]}`}>
          {report.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Screenshot Thumbnail */}
      {report.screenshotUrl && (
         <div className="cursor-pointer group relative" onClick={() => onImageClick(report.screenshotUrl)}>
            <img 
                src={report.screenshotUrl} 
                alt="Screenshot thumbnail" 
                className="rounded-md object-cover w-full h-40 group-hover:opacity-80 transition-opacity"
            />
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-bold">View Full Size</span>
            </div>
         </div>
      )}
      
      {/* Notes Section */}
      {report.notes && (
        <div className="pt-2 border-t border-slate-700">
            <p className="text-sm text-slate-300 italic">"{report.notes}"</p>
        </div>
      )}

      {/* Work Link Button */}
       {report.workLink && (
          <div className="flex justify-end mt-2">
            <a 
              href={report.workLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all"
            >
              <HiExternalLink className="h-4 w-4" />
              View Work
            </a>
          </div>
        )}
    </div>
  );
};

export default ReportCard;