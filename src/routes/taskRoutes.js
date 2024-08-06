const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, assignTask, getAssignedTasks, } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), createTask);
router.get('/', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), getTasks);
router.put('/:id', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), updateTask);
router.delete('/:id', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), deleteTask);

router.post('/assign', authMiddleware, roleMiddleware(['Manager', 'Admin']), assignTask);
router.get('/assigned', authMiddleware, roleMiddleware(['User', 'Manager', 'Admin']), getAssignedTasks);


module.exports = router;
