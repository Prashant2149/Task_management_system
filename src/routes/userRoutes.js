const express = require('express');
const { register, login, getProfile, updateNotificationPreferences  } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();
const { validateUserRegistration, validateUserLogin, checkValidation } = require('../utils/validate');



router.post('/register',validateUserRegistration,checkValidation, register);
router.post('/login',validateUserLogin,checkValidation, login);
router.get('/profile', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), getProfile);
router.put('/notification-preferences', authMiddleware, updateNotificationPreferences);

module.exports = router;
