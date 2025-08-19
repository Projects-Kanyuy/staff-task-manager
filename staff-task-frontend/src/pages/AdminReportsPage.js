// frontend/src/pages/AdminReportsPage.js

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import ReportCard from '../components/ReportCard';
import ImageViewerModal from '../components/ImageViewerModal';
import api from '../services/api';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ staffId: '', date: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialFilter = params.get('filter');

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const reportsRes = await api.get('/reports', { params: { filter: initialFilter } });
        setReports(reportsRes.data.data);

        const staffRes = await api.get('/tasks/staff');
        setStaffUsers(staffRes.data);
      } catch (error) {
        console.error("Failed to fetch reports or staff:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [initialFilter]);

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
  
  const clearFilter = () => {
    navigate('/admin/reports'); // Navigate to the admin route
  };

  if (isLoading) { return <div className="text-center p-8 text-slate-400">Loading reports...</div>; }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-50">Global Staff Reports</h1>

      {initialFilter && (
        <div className="mb-6 flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-300">
            Showing: <span className="font-bold text-purple-400">Reports Submitted Today</span>
          </p>
          <button onClick={clearFilter} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white">
            <HiX /> Clear Filter
          </button>
        </div>
      )}

      <div className="bg-slate-900/50 border border-purple-500/20 p-4 rounded-xl mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Staff</label>
          <select name="staffId" value={filters.staffId} onChange={handleFilterChange} className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">All Staff</option>
            {staffUsers.map(staff => <option key={staff._id} value={staff._id}>{staff.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Date</label>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report._id} report={report} onImageClick={setSelectedImage} />
          ))
        ) : (
          <p className="text-slate-400 col-span-full text-center py-8">No reports found for the selected filters.</p>
        )}
      </div>
      <ImageViewerModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default AdminReportsPage;