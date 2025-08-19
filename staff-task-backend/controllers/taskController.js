// backend/controllers/taskController.js

const Task = require('../models/Task');
const User = require('../models/User');
const Report = require('../models/Report'); 

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { filter } = req.query; // Get the filter from query params
    let query = {}; // Start with an empty query object

    // Apply filters based on the query parameter
    if (filter === 'created_today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: today };
    } else if (filter === 'overdue') {
      query.dueDate = { $lt: new Date() };
    }

    const tasks = await Task.find(query) // Use the dynamic query object
      .populate('assigneeIds', 'name')
      .sort({ createdAt: -1 });

    const taskIds = tasks.map(t => t._id);
    const reports = await Report.find({ taskId: { $in: taskIds } }).select('taskId');
    const reportedTaskIds = new Set(reports.map(r => r.taskId.toString()));

    const tasksWithReportStatus = tasks.map(task => ({
      ...task.toObject(),
      hasBeenReported: reportedTaskIds.has(task._id.toString())
    }));
      
    res.json({
      data: tasksWithReportStatus,
      // Note: Pagination is removed for filtered views for simplicity, can be added back
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Create a task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  const { title, description, assigneeIds, dueDate, priority } = req.body;
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

    const newTask = new Task({ title, description, assigneeIds: finalAssignees, dueDate, priority, creatorId });
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

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
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

    // 2. Get the start and end of the current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 3. Find all reports submitted by this user today
    const reportsToday = await Report.find({
      staffId: req.user.id,
      submittedAt: { $gte: today, $lt: tomorrow },
    });
    
    // 4. Create a simple list of task IDs that have been submitted
    const submittedTaskIds = new Set(reportsToday.map(report => report.taskId.toString()));

    // 5. Add a 'hasSubmittedToday' flag to each task object
    const tasksWithStatus = tasks.map(task => {
      return {
        ...task.toObject(), // Convert from Mongoose object to plain JS object
        hasSubmittedToday: submittedTaskIds.has(task._id.toString())
      };
    });

    res.json(tasksWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};