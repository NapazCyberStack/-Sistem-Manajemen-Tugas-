const express = require('express');
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Mount at root level directly
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

module.exports = router;
