/**
 * Backend route protection untuk Admin
 * Ditambahkan di taskRoutes untuk endpoint admin-only
 * 
 * Commit 26: feat: add admin route protection & error handling
 */

const express = require('express');
const taskController = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { taskRules } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Apply protect middleware to all task routes
router.use(protect);

// Dashboard statistics (semua user)
router.get('/stats', taskController.getStats);

// CRUD routes untuk tasks (/data)
router.get('/data', taskController.getAllTasks);
router.post('/data', taskRules, taskController.createTask);

router.get('/data/:id', taskController.getTaskById);
router.put('/data/:id', taskRules, taskController.updateTask);
router.delete('/data/:id', taskController.deleteTask);

// Admin-only: lihat semua tugas semua user
router.get('/admin/all', authorize('Admin'), taskController.getAllTasks);

module.exports = router;
