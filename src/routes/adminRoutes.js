const express = require('express');
const { getAllUsers, updateUserRoles } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/users', authMiddleware, roleMiddleware(['Admin']), getAllUsers);
router.put('/users/roles', authMiddleware, roleMiddleware(['Admin']), updateUserRoles);

module.exports = router;
