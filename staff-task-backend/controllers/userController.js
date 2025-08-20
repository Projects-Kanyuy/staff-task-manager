// backend/controllers/userController.js

const User = require('../models/User');
const Task = require('../models/Task');
const Report = require('../models/Report');

// @desc    Get all users (for Admin view, with pagination)
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({});
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({ data: users, currentPage: page, totalPages: totalPages });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new user (by Admin/Manager)
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const creatorRole = req.user.role;

    if (creatorRole === 'manager' && role !== 'staff') {
        return res.status(403).json({ msg: 'Managers can only create Staff accounts.' });
    }
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

// @desc    Update a user (by Admin)
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

// @desc    Delete a user (by Admin)
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

// @desc    Get dashboard statistics (for Admin)
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

        res.json({ totalUsers, userCountsByRole, tasksCreatedToday, reportsSubmittedToday, tasksOverdue });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update logged-in user's profile
exports.updateMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const existingUser = await User.findOne({ email: user.email });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'Email is already in use' });
        }

        const updatedUser = await user.save();
        res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Change password
exports.changeMyPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please provide both current and new passwords' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ msg: 'Incorrect current password' });

        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Public directory
exports.getAllUsersPublic = async (req, res) => {
    try {
        const users = await User.find({}).sort({ name: 1 }).select('name email role createdAt');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all staff users (for Manager's view)
exports.getStaffOnly = async (req, res) => {
    try {
        const users = await User.find({ role: 'staff' }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
