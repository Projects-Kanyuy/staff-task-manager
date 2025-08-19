import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import ReportCard from '../components/ReportCard';
import ImageViewerModal from '../components/ImageViewerModal';

const ManagerReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ staffId: '', date: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // --- NEW STATE FOR NOTIFICATIONS ---
  const [knownReportCount, setKnownReportCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const fetchReports = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/reports?page=${page || 1}&limit=9`);
      setReports(data.data.map(report => ({
        ...report,
        staffName: report.staffId ? report.staffId.name : 'Unknown Staff',
        taskTitle: report.taskId ? report.taskId.title : 'Deleted Task'
      })));
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/staff/users');
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch staff users:", error);
    }
  }, []);

  // --- NEW useEffect FOR POLLING ---
  useEffect(() => {
    api.get('/reports/count').then(res => setKnownReportCount(res.data.count));
    
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get('/reports/count');
        if (data.count > knownReportCount) {
          setShowNotification(true);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [knownReportCount]);

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, fetchReports]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = async () => {
    setShowNotification(false);
    await fetchReports(1); // Refresh and go to the first page
    const { data } = await api.get('/reports/count');
    setKnownReportCount(data.count); // Update the known count
  };
  
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const staffMatch = !filters.staffId || report.staffId._id === filters.staffId;
      const dateMatch = !filters.date || new Date(report.submittedAt).toISOString().startsWith(filters.date);
      return staffMatch && dateMatch;
    });
  }, [reports, filters]);

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageClick = (url) => setSelectedImage(url);
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1) };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1) };

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Staff Reports</h1>
      
      {/* --- NEW NOTIFICATION BAR --- */}
      {showNotification && (
        <div className="bg-blue-600/80 backdrop-blur-sm text-white p-3 rounded-lg mb-6 flex justify-between items-center shadow-lg animate-pulse">
          <span>New reports have been submitted.</span>
          <button onClick={handleRefresh} className="font-bold bg-white/20 px-3 py-1 rounded-md hover:bg-white/30 transition-colors">
            Refresh to View
          </button>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg mb-6 flex items-center gap-4">
        {/* Filter inputs */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report._id} report={report} onImageClick={handleImageClick} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-8">No reports found for the selected filters.</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        {/* Pagination controls */}
      </div>

      <ImageViewerModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default ManagerReportsPage;