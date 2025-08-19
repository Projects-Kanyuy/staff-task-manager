// src/components/ReportCard.js
import React from 'react';

const statusClasses = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  partial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  not_completed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ReportCard = ({ report, onImageClick }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-lg shadow-lg flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-50">{report.taskTitle}</h3>
          <p className="text-sm text-gray-400">by <span className="font-semibold">{report.staffName}</span> on {report.date}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusClasses[report.status]}`}>
          {report.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Screenshot Thumbnail */}
      {report.screenshotUrl && (
         <div className="cursor-pointer group" onClick={() => onImageClick(report.screenshotUrl)}>
            <img 
                src={report.screenshotUrl} 
                alt="Screenshot thumbnail" 
                className="rounded-md object-cover w-full h-40 group-hover:opacity-80 transition-opacity"
            />
         </div>
      )}
      
      {/* Notes */}
      {report.notes && (
        <div className="pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-300 italic">"{report.notes}"</p>
        </div>
      )}
    </div>
  );
};

export default ReportCard;