const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
const { sendConfirmationEmail,sendResetPasswordEmail } = require('../utils/emailService');


const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const registerUser = async ({ name, email, phoneNumber, role, status, password }) => {
  if (!name || !email || !phoneNumber || !role || !status || !password) {
    throw new Error('All fields are required');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const newUser = new User({
    name,
    email,
    phoneNumber,
    role,
    status,
    password,
  });

  try {
    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
  issuer: "UserAPI",
  audience: "UserAPIUsers",
  expiresIn: "1h"
});
    await sendConfirmationEmail(email, token);
    return savedUser;
  } catch (error) {
    throw new Error('Error registering user');
  }
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  issuer: "UserAPI",
  audience: "UserAPIUsers",
  expiresIn: "1h"
});
  return { token, user };
};


const confirmEmail = async (email) => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  user.mailConfirmed = true;
  await user.save();

  return { message: 'Email confirmed successfully' };
};

const forgotPassword = async (email) => {

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email is not registered');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h',algorithm: "HS256", });
  await sendResetPasswordEmail(email, token);
  
  return { message: 'Reset password email sent' };
};

const resetPassword = async (req, newPassword) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log(token);
  if (!token) {
    throw new Error('Token not provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "UserAPI",
      audience: "UserAPIUsers"
      
    });
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Password reset successful' };
};
 
const changePassword = async (email, oldPassword, newPassword) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email is not registered');
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }
 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
  }

  user.password =newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};



module.exports = { registerUser, loginUser,confirmEmail, forgotPassword, resetPassword, changePassword };
