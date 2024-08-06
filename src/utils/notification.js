const twilioClient = require('../config/twilio');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendNotification = async (userId, subject, message) => {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  if (user.notificationPreferences.email) {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject,
      text: message,
    });
  }

  if (user.notificationPreferences.sms) {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });
  }
};

module.exports = { sendNotification };
