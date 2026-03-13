const { registerUser, loginUser,confirmEmail, forgotPassword, resetPassword, changePassword  } = require('../services/authService');

exports.registerUser = async (req, res) => {
  const { name, email, phoneNumber, role, password,status } = req.body;

  try {
    await registerUser({ name, email, phoneNumber, role, status, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.confirmEmail = async (req, res) => {
  const { email } = req.params;  

  try {
    const response = await confirmEmail(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await forgotPassword(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const response = await resetPassword(req, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const response = await changePassword(email, oldPassword, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};