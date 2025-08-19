// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    getStats
} = require('../controllers/userController');

// Apply protect and isAdmin middleware to all routes in this file
router.use(protect, isAdmin);

router.route('/')
    .get(getAllUsers)
    .post(createUser);
router.get('/stats', getStats);


router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;