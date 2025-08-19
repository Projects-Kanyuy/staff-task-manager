// controllers/userController.js
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Create a user (by admin)
// @route   POST /api/users
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await user.remove();
        res.json({ msg: 'User removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};