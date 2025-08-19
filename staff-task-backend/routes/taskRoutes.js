// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById, // <-- This function was causing the crash
  updateTask,
  deleteTask,
  getStaff,    // <-- We need to import this
  getMyTasks   // <-- We need to import this
} = require('../controllers/taskController');
const { protect, isManager } = require('../middleware/authMiddleware');

// === General Routes ===
router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks); // For managers to get all tasks

// === Specific Routes (MUST BE DEFINED BEFORE /:id) ===

// GET /api/tasks/staff - For managers to get a list of staff for the dropdown
router.get('/staff', protect, isManager, getStaff);

// GET /api/tasks/mytasks - For a logged-in staff member to get only their tasks
router.get('/mytasks', protect, getMyTasks);


// === Route for a single task by ID (MUST BE LAST) ===
// This route is for getting, updating, or deleting a specific task
router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, isManager, updateTask)
  .delete(protect, isManager, deleteTask);

module.exports = router;