const Report = require('../models/Report');
const Task = require('../models/Task');
exports.createReport = async (req, res) => {
  // Destructure workLink from the body
  const { taskId, status, notes, workLink } = req.body;
  
  try {
    if (!taskId || !status) {
        return res.status(400).json({ msg: 'Task ID and status are required.' });
    }

    const screenshotUrl = req.file ? req.file.path : null;
    if (!screenshotUrl) {
      return res.status(400).json({ msg: 'Please upload a screenshot as proof.' });
    }

    const newReport = new Report({
      taskId,
      status,
      notes,
      workLink, // Save the new link field
      staffId: req.user.id,
      screenshotUrl,
    });

    const report = await newReport.save();
    
    // --- Notification Logic (unchanged) ---
    const task = await Task.findById(taskId);
    if (task) {
      const creatorId = task.creatorId.toString();
      const io = req.io;
      const onlineUsers = req.onlineUsers;
      
      if (onlineUsers.has(creatorId)) {
        const socketId = onlineUsers.get(creatorId);
        io.to(socketId).emit('newReport', {
          taskTitle: task.title,
          staffName: req.user.name
        });
        console.log(`Sent 'newReport' notification to manager ${creatorId}`);
      }
    }
    // --- END NOTIFICATION LOGIC ---
    
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

exports.getMyReports = async (req, res) => {
  try {
    // Find all reports for the logged-in user
    const reports = await Report.find({ staffId: req.user.id })
      .populate('taskId', 'title') // This will attempt to get the task's title
      .sort({ submittedAt: -1 });
      
    // Add a console.log for debugging on the backend terminal
    console.log(`[DEBUG] Found ${reports.length} reports for user ${req.user.id}`);

    // Filter out any reports where the original task might have been deleted
    const validReports = reports.filter(report => report.taskId !== null);

    res.json(validReports);
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
exports.getAllReports = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === 'submitted_today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.submittedAt = { $gte: today };
    }

    const reports = await Report.find(query)
      .populate('staffId', 'name')
      .populate('taskId', 'title')
      .sort({ submittedAt: -1 });

    res.json({ data: reports });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
