const express = require('express');
const router = express.Router();
const { protect, isManager } = require('../middleware/authMiddleware');
const uploadCloudinary = require('../middleware/cloudinaryUploadMiddleware');
const { 
    createReport, 
    getReports, 
    getMyReports, 
    getReportCount // --- IMPORT NEW FUNCTION ---
} = require('../controllers/reportController');

router.use(protect);

// == STAFF ROUTES ==
router.post('/', uploadCloudinary.single('screenshot'), createReport);
router.get('/myreports', getMyReports);

// == MANAGER ROUTES ==
router.use(isManager);

// GET /api/reports - Get paginated reports
router.get('/', getReports);

// --- NEW ROUTE ---
// GET /api/reports/count - Get total report count
router.get('/count', getReportCount);

module.exports = router;