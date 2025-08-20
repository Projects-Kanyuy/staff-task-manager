// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect, isAdmin, isManager } = require('../middleware/authMiddleware');

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getStats,
    updateMyProfile,
    changeMyPassword,
    getAllUsersPublic,
    getStaffOnly,
    getUserById
} = require('../controllers/userController');
console.log({
    protect,
    isAdmin,
    isManager,
    getUserById
});

// === Routes for ANY logged-in user ===
router.put('/profile', protect, updateMyProfile);
router.put('/change-password', protect, changeMyPassword);
router.get('/directory', protect, getAllUsersPublic);

// === Route for MANAGERS ONLY ===
router.get('/staff-only', protect, isManager, getStaffOnly);

// === Routes for ADMINS ONLY ===
router.get('/stats', protect, isAdmin, getStats);

router.route('/')
    .get(protect, isAdmin, getUsers)
    .post(protect, isManager, createUser);

router.route('/:id')
    .get(protect, isAdmin, getUserById) // ✅ fixed
    .put(protect, isAdmin, updateUser)
    .delete(protect, isAdmin, deleteUser);

module.exports = router;
