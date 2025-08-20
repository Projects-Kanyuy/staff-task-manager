// frontend/src/pages/ManagerReportsPage.js

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ReportCard from '../components/ReportCard';
import ImageViewerModal from '../components/ImageViewerModal';
import PaginationControls from '../components/PaginationControls';
import api from '../services/api';

const ManagerReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ staffId: '', date: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showNotification, setShowNotification] = useState(false);
  const [knownReportCount, setKnownReportCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const initialFilter = new URLSearchParams(location.search).get('filter');

  const fetchPageData = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const reportsRes = await api.get('/reports', { params: { filter: initialFilter, page, limit: 9 } });
      setReports(reportsRes.data.data);
      setCurrentPage(reportsRes.data.currentPage);
      setTotalPages(reportsRes.data.totalPages);

      if (staffUsers.length === 0) {
        const staffRes = await api.get('/tasks/staff');
        setStaffUsers(staffRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Could not load reports data.");
    } finally {
      setIsLoading(false);
    }
  }, [initialFilter, staffUsers.length]); // Dependency array for useCallback

  useEffect(() => {
    fetchPageData(1); // Fetch initial data on mount or when URL filter changes
  }, [fetchPageData]);

  // Polling for new reports
  useEffect(() => {
    api.get('/reports/count').then(res => setKnownReportCount(res.data.count));
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get('/reports/count');
        if (data.count > knownReportCount) {
          setShowNotification(true);
        }
      } catch (error) { console.error("Polling error:", error); }
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [knownReportCount]);

  const handleRefresh = async () => {
    setShowNotification(false);
    await fetchPageData(1); // Refresh and go back to page 1
    const { data } = await api.get('/reports/count');
    setKnownReportCount(data.count);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // This filters the currently displayed reports on the client-side
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const staffMatch = !filters.staffId || report.staffId?._id === filters.staffId;
      const dateMatch = !filters.date || new Date(report.submittedAt).toISOString().startsWith(filters.date);
      return staffMatch && dateMatch;
    });
  }, [reports, filters]);
  
  const clearUrlFilter = () => {
    navigate('/manager/reports');
  };

  if (isLoading) {
    return <div className="text-center p-8 text-slate-400">Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-50">Staff Reports</h1>

      {showNotification && (
        <div className="bg-blue-600/80 backdrop-blur-sm text-white p-3 rounded-lg mb-6 flex justify-between items-center shadow-lg animate-pulse">
          <span>New reports have been submitted.</span>
          <button onClick={handleRefresh} className="font-bold bg-white/20 px-3 py-1 rounded-md hover:bg-white/30 transition-colors">Refresh to View</button>
        </div>
      )}

      {initialFilter && (
        <div className="mb-6 flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <p className="text-slate-300">
            Showing: <span className="font-bold text-purple-400">Reports Submitted Today</span>
          </p>
          <button onClick={clearUrlFilter} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white">
            <HiX /> Clear Filter
          </button>
        </div>
      )}
      
      {/* Restored futuristic filter bar */}
      <div className="bg-slate-900/50 border border-purple-500/20 p-4 rounded-xl mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Staff</label>
          <select 
            name="staffId" 
            value={filters.staffId} 
            onChange={handleFilterChange} 
            className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-slate-800">All Staff</option>
            {staffUsers.map(staff => <option key={staff._id} value={staff._id} className="bg-slate-800">{staff.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Date</label>
          <input 
            type="date" 
            name="date" 
            value={filters.date} 
            onChange={handleFilterChange} 
            className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report._id} report={report} onImageClick={setSelectedImage} />
          ))
        ) : (
          <div className="col-span-full text-center p-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
            <p className="text-slate-400">No reports found for the selected filters.</p>
          </div>
        )}
      </div>
      
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={fetchPageData} 
      />
      <ImageViewerModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default ManagerReportsPage;