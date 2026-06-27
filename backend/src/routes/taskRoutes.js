/**
 * Backend route protection untuk Admin
 * Ditambahkan di taskRoutes untuk endpoint admin-only
 * 
 * Commit 26: feat: add admin route protection & error handling
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const taskController = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { taskRules } = require('../middlewares/validationMiddleware');

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').toLowerCase()}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Bukti foto harus berupa file gambar (jpg, jpeg, png, webp).'));
    }
  }
});

const router = express.Router();

// Apply protect middleware to all task routes
router.use(protect);

// Dashboard statistics (semua user)
router.get('/stats', taskController.getStats);

// CRUD routes untuk tasks (/data)
router.get('/data', taskController.getAllTasks);
router.post('/data', upload.single('proofImage'), taskRules, taskController.createTask);

router.get('/data/:id', taskController.getTaskById);
router.put('/data/:id', upload.single('proofImage'), taskRules, taskController.updateTask);
router.delete('/data/:id', taskController.deleteTask);

// Admin-only: lihat semua tugas semua user
router.get('/admin/all', authorize('Admin'), taskController.getAllTasks);

module.exports = router;
