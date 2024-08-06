const { body, param, validationResult } = require('express-validator');

// Middleware to check for validation errors
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  console.log(JSON.stringify(errors));
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone is required')
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Task validation rules
const validateTaskCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().toDate().withMessage('Please provide a valid date'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority value'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),
  checkValidation
];

const validateTaskUpdate = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().toDate().withMessage('Please provide a valid date'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority value'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),
  checkValidation
];

const validateTaskAssignment = [
  body('taskId').isMongoId().withMessage('Invalid task ID'),
  body('assignedUserId').isMongoId().withMessage('Invalid user ID'),
  checkValidation
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskAssignment,
  checkValidation
};
