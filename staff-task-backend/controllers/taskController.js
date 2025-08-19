// controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Get the total number of tasks to calculate total pages
    const totalTasks = await Task.countDocuments({});
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.find({})
      .populate('assigneeIds', 'name')
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .skip(skip);
      
    res.json({
      data: tasks,
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
  const { title, description, assigneeIds, dueDate, priority } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      assigneeIds,
      dueDate,
      priority,
      creatorId: req.user.id,
    });
    const task = await newTask.save();
    res.status(201).json(task);
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
    
    await Task.findByIdAndRemove(req.params.id);
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
exports.getMyTasks = async (req, res) => {
  try {
    // req.user.id is available from the 'protect' middleware
    const tasks = await Task.find({ assigneeIds: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};