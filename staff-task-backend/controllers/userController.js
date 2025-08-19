// backend/controllers/userController.js

const User = require('../models/User');
// --- ADD THESE TWO MISSING LINES ---
const Task = require('../models/Task');
const Report = require('../models/Report');
// ------------------------------------

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new user (by Admin)
// @route   POST /api/users
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    const fieldsToUpdate = { name, email, role };
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user = await User.findByIdAndUpdate(req.params.id, { $set: fieldsToUpdate }, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get dashboard statistics for the admin panel
// @route   GET /api/users/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const userCountsByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tasksCreatedToday = await Task.countDocuments({ createdAt: { $gte: today } });
        const reportsSubmittedToday = await Report.countDocuments({ submittedAt: { $gte: today } });
        const tasksOverdue = await Task.countDocuments({ dueDate: { $lt: new Date() } });
        res.json({
            totalUsers,
            userCountsByRole,
            tasksCreatedToday,
            reportsSubmittedToday,
            tasksOverdue
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};