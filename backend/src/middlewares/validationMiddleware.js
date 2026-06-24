const { body, validationResult } = require('express-validator');

// Generic helper to handle validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for Register
const registerRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['Admin', 'User']).withMessage('Role must be either Admin or User'),
  validateResults
];

// Validation rules for Login
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validateResults
];

// Validation rules for Task Creation / Modification
const taskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be Pending, In Progress, or Completed'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date format (YYYY-MM-DD)'),
  validateResults
];

module.exports = {
  registerRules,
  loginRules,
  taskRules
};
