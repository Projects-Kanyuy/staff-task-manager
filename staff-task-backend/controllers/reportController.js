const Report = require('../models/Report');

// This function is unchanged
exports.createReport = async (req, res) => {
  const { taskId, status, notes } = req.body;
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload a screenshot' });
  }
  try {
    const newReport = new Report({
      taskId,
      status,
      notes,
      staffId: req.user.id,
      screenshotUrl: req.file.path,
    });
    const report = await newReport.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// This function is unchanged (already includes pagination)
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalReports = await Report.countDocuments({});
    const totalPages = Math.ceil(totalReports / limit);

    const reports = await Report.find({})
      .populate('staffId', 'name')
      .populate('taskId', 'title')
      .sort({ submittedAt: -1 })
      .limit(limit)
      .skip(skip);
      
    res.json({
        data: reports,
        currentPage: page,
        totalPages: totalPages,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// This function is unchanged
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ staffId: req.user.id })
      .populate('taskId', 'title')
      .sort({ submittedAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTION ---
// @desc    Get the total count of reports
// @route   GET /api/reports/count
exports.getReportCount = async (req, res) => {
  try {
    const count = await Report.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};