const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerRules, loginRules } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

// Protected routes
router.get('/me', protect, authController.getProfile);
router.post('/logout', protect, authController.logout);

module.exports = router;
