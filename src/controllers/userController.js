const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, roles} = req.body;
    const user = new User({ username, email, password, roles});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationPreferences = async (req, res) => {
    try {
      const { email, sms } = req.body;
      const user = await User.findByIdAndUpdate(req.user.userId, {
        notificationPreferences: { email, sms }
      }, { new: true });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {register, login, getProfile,updateNotificationPreferences }