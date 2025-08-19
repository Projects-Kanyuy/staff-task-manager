// src/components/ReportCard.js
import React from 'react';

const statusClasses = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  partial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  not_completed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ReportCard = ({ report, onImageClick }) => {
  return (
    <div className="bg-slate-900/50 border border-purple-500/20 p-5 rounded-xl shadow-lg flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-50">{report.taskId?.title || 'Task Deleted'}</h3>
          <p className="text-sm text-slate-400">by <span className="font-semibold">{report.staffId?.name || 'User Deleted'}</span> on {new Date(report.submittedAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusClasses[report.status]}`}>
          {report.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      {report.screenshotUrl && (
         <div className="cursor-pointer group" onClick={() => onImageClick(report.screenshotUrl)}>
            <img 
                src={report.screenshotUrl} // This will now be a Cloudinary URL
                alt="Screenshot thumbnail" 
                className="rounded-md object-cover w-full h-40 group-hover:opacity-80 transition-opacity"
            />
         </div>
      )}
      {report.notes && (
        <div className="pt-2 border-t border-slate-700">
            <p className="text-sm text-slate-300 italic">"{report.notes}"</p>
        </div>
      )}
    </div>
  );
};

export default ReportCard;