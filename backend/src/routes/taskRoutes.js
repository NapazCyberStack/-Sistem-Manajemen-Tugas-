const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { taskRules } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Apply protect middleware to all task routes
router.use(protect);

// Dashboard statistics
router.get('/stats', taskController.getStats);

// CRUD routes for tasks (/data)
router.get('/data', taskController.getAllTasks);
router.post('/data', taskRules, taskController.createTask);

router.get('/data/:id', taskController.getTaskById);
router.put('/data/:id', taskRules, taskController.updateTask);
router.delete('/data/:id', taskController.deleteTask);

module.exports = router;
