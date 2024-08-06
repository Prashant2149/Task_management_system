const Task = require('../models/Task');
const { sendNotification } = require('../utils/notification');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const task = new Task({ title, description, dueDate, priority, status, user: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order } = req.query;
    const filter = { user: req.user.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find(filter).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const  assignTask = async (req, res) => {
    try {
      const { taskId, assignedUserId } = req.body;
  
      // Check if the assigned user exists
      const user = await User.findById(assignedUserId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Check if the task exists and belongs to the requester (if not admin)
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Additional check: if the requester is a manager, ensure the user is in their team
      if (req.user.roles.includes('Manager')) {
        // Assuming you have a team structure, add your team validation logic here
        console.log("This is Manager");
      }
  
      task.assignedUser = assignedUserId;
      await task.save();

      sendNotification(assignedUserId, 'Task Assigned', `You have been assigned a new task: ${task.title}`);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dueDate, priority, status } = req.body;
  
      const task = await Task.findOneAndUpdate(
        { _id: id, user: req.user.userId },
        { title, description, dueDate, priority, status },
        { new: true }
      );
  
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      sendNotification(task.assignedUser, 'Task Updated', `Task "${task.title}" has been updated.`);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getAssignedTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ assignedUser: req.user.userId });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  module.exports = {getAssignedTasks, updateTask, assignTask , deleteTask, getTasks, createTask}