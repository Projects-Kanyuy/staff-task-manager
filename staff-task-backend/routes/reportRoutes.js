// backend/routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { protect, isManager } = require('../middleware/authMiddleware');
const uploadCloudinary = require('../middleware/cloudinaryUploadMiddleware');
const { 
    createReport, 
    getReports, 
    getMyReports, 
    getReportCount,
    getAllReports
} = require('../controllers/reportController');
const { isAdmin } = require('../middleware/adminMiddleware');

// All report routes are protected
router.use(protect);

// Staff-specific routes
router.post('/', uploadCloudinary.single('screenshot'), createReport);
router.get('/myhistory', getMyReports);

// Manager-specific routes
// These routes will first check for login (protect), then check for manager role (isManager)
router.get('/', isManager, getReports);
router.get('/count', isManager, getReportCount);
// Route to get all reports (for admin or manager)
router.get('/all', isAdmin, getAllReports);

module.exports = router;