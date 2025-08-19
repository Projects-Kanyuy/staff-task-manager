// frontend/src/pages/ManagerReportsPage.js

import React, { useState, useMemo, useEffect } from 'react';
import ReportCard from '../components/ReportCard';
import ImageViewerModal from '../components/ImageViewerModal';
import api from '../services/api';

const ManagerReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ staffId: '', date: '' });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const reportsRes = await api.get('/reports');
        setReports(reportsRes.data.data);

        const staffRes = await api.get('/tasks/staff'); // <-- CORRECTED API PATH
        setStaffUsers(staffRes.data);
      } catch (error) {
        console.error("Failed to fetch reports or staff:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const staffMatch = !filters.staffId || report.staffId._id === filters.staffId;
      const dateMatch = !filters.date || new Date(report.submittedAt).toISOString().startsWith(filters.date);
      return staffMatch && dateMatch;
    });
  }, [reports, filters]);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-400">Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Staff Reports</h1>
      <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Staff</label>
          <select name="staffId" value={filters.staffId} onChange={handleFilterChange} className="w-full px-4 py-2 text-gray-200 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Staff</option>
            {staffUsers.map(staff => <option key={staff._id} value={staff._id}>{staff.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Date</label>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-2 text-gray-200 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report._id} report={report} onImageClick={setSelectedImage} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-8">No reports found for the selected filters.</p>
        )}
      </div>
      <ImageViewerModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default ManagerReportsPage;