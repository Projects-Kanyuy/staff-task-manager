// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isManager } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getStaff,
   getMyTasks,
} = require('../controllers/taskController');

// All these routes are protected and require a manager/admin role
router.get('/mytasks', getMyTasks);
router.use(protect);
router.use(isManager);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);
  
// Special route to get staff members
router.get('/staff/users', getStaff);

module.exports = router;