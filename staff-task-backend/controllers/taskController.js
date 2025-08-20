// backend/controllers/taskController.js

const Task = require('../models/Task');
const User = require('../models/User');
const Report = require('../models/Report'); 

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // --- ADVANCED FILTERING LOGIC ---
    const { filter, priority, assignee, sort } = req.query;
    let query = {};

    // Build the query object based on provided filters
    if (priority) query.priority = priority;
    if (assignee) query.assigneeIds = assignee;
    
    // Date-based filters from the dashboard cards
    if (filter === 'created_today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: today };
    } else if (filter === 'overdue') {
      query.dueDate = { $lt: new Date() };
    }
    
    // --- SORTING LOGIC ---
    let sortOptions = { createdAt: -1 }; // Default sort: newest first
    if (sort === 'dueDateAsc') sortOptions = { dueDate: 1 };
    if (sort === 'dueDateDesc') sortOptions = { dueDate: -1 };
    if (sort === 'priority') sortOptions = { priority: -1 };

    // --- Database Query ---
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.find(query)
      .populate('assigneeIds', 'name')
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    const taskIds = tasks.map(t => t._id);
    const reports = await Report.find({ taskId: { $in: taskIds } }).select('taskId');
    const reportedTaskIds = new Set(reports.map(r => r.taskId.toString()));

    const tasksWithReportStatus = tasks.map(task => ({
      ...task.toObject(),
      hasBeenReported: reportedTaskIds.has(task._id.toString())
    }));
      
    res.json({
      data: tasksWithReportStatus,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Create a task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  const { title, description, assigneeIds, dueDate, priority, startTime, endTime } = req.body;
  const creatorId = req.user.id;
  try {
    let finalAssignees;
    if (req.user.role === 'staff') {
      finalAssignees = [creatorId];
    } else if (req.user.role === 'manager' && (!assigneeIds || assigneeIds.length === 0)) {
      return res.status(400).json({ msg: 'Manager must assign the task.' });
    } else {
      finalAssignees = assigneeIds;
    }
    const newTask = new Task({ title, description, assigneeIds: finalAssignees, dueDate, priority, creatorId, startTime, endTime });
    const task = await newTask.save();

    // --- NOTIFICATION LOGIC ---
    if (finalAssignees && finalAssignees.length > 0) {
      const io = req.io;
      const onlineUsers = req.onlineUsers;

      finalAssignees.forEach(assigneeId => {
        const assigneeIdStr = assigneeId.toString();
        if (onlineUsers.has(assigneeIdStr)) {
          const socketId = onlineUsers.get(assigneeIdStr);
          io.to(socketId).emit('newTask', {
            title: task.title,
            creatorName: req.user.name
          });
          console.log(`Sent 'newTask' notification to user ${assigneeIdStr}`);
        }
      });
    }
    // --- END NOTIFICATION LOGIC ---

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Get a single task by its ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assigneeIds', 'name email');
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Create an update object from the request body
    const { title, description, assigneeIds, dueDate, priority, startTime, endTime } = req.body;
    const updateFields = { title, description, assigneeIds, dueDate, priority, startTime, endTime };

    task = await Task.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Note: Mongoose 6+ does not have findByIdAndRemove, use findByIdAndDelete
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get all staff users (for the dropdown)
// @route   GET /api/tasks/staff
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('name');
        res.json(staff);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

// @desc    Get tasks assigned to the logged-in user
// @route   GET /api/tasks/mytasks
exports.getMyTasks = async (req, res) => {
  try {
    // 1. Get all tasks assigned to this user
    const tasks = await Task.find({ assigneeIds: req.user.id });

    // 2. Get all reports ever submitted by this user
    const allUserReports = await Report.find({ staffId: req.user.id });

    // 3. Create a simple string for today's date, e.g., "2024-08-20"
    // This ignores time and timezones completely.
    const todayDateString = new Date().toISOString().slice(0, 10);

    // 4. Create a Set of task IDs that have a report submitted on today's calendar date
    const submittedTaskIdsToday = new Set(
      allUserReports
        .filter(report => report.submittedAt.toISOString().slice(0, 10) === todayDateString)
        .map(report => report.taskId.toString())
    );

    // 5. Add a 'hasSubmittedToday' flag to each task object
    const tasksWithStatus = tasks.map(task => ({
      ...task.toObject(),
      hasSubmittedToday: submittedTaskIdsToday.has(task._id.toString())
    }));

    res.json(tasksWithStatus);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};