const User = require('../models/User');
const PDFDocument = require('pdfkit');
const validator = require('validator');
const { sendConfirmationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');



const createUser = async ({ name, email, phoneNumber, role, status, password }) => {
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

const updateUserById = async (params, updateData) => {
  const { id } = params;

  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const { name, email, phoneNumber, role, status } = updateData;


    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

  
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.role = role;
    user.status = status;
    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const getUsers = async (query) => {
  const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'descend', search = '' } = query;

  const searchFilter = {
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ],
  };

  const sortOptions = { [sortField == 'name' ? 'firstName' : sortField]: sortOrder === 'ascend' ? 1 : -1 };

  const users = await User.find(searchFilter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalCount = await User.countDocuments(searchFilter);

  return {
    users,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / limit),
  };
};

const getUsersById = async (params) => {
  const { id } = params;

  if (!id) {
    throw new Error('User ID is required');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const exportToPDF = async () => {
  const users = await User.find({});
  const doc = new PDFDocument();
  const marginLeft = 30;
  const marginTop = 100;

  const columnWidths = [100, 120, 80, 50, 50, 150];
  const rowHeight = 30;
  const startX = marginLeft;
  const startY = marginTop;

  const verticalCenterAdjustment = ((rowHeight - 15) / 2);
  doc.text('Name', startX, startY + verticalCenterAdjustment, { width: columnWidths[0], align: 'left' });
  doc.text('Email', startX + columnWidths[0], startY + verticalCenterAdjustment, { width: columnWidths[1], align: 'left' });
  doc.text('Phone', startX + columnWidths[0] + columnWidths[1], startY + verticalCenterAdjustment, { width: columnWidths[2], align: 'left' });
  doc.text('Role', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY + verticalCenterAdjustment, { width: columnWidths[3], align: 'left' });
  doc.text('Gender', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], startY + verticalCenterAdjustment, { width: columnWidths[4], align: 'left' });
  doc.text('Address', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], startY + verticalCenterAdjustment, { width: columnWidths[5], align: 'left' });

  doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b), rowHeight)

  users?.forEach((user, index) => {
    const rowY = startY + (index + 2) * rowHeight;
    doc.text(`${user.firstName} ${user.lastName}`, startX, rowY + verticalCenterAdjustment, { width: columnWidths[0], align: 'left' });

    doc.text(user.email, startX + columnWidths[0], rowY + verticalCenterAdjustment, { width: columnWidths[1], align: 'left' });
    doc.text(user.phoneNumber, startX + columnWidths[0] + columnWidths[1], rowY + verticalCenterAdjustment, { width: columnWidths[2], align: 'left' });
    doc.text(user.role, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], rowY + verticalCenterAdjustment, { width: columnWidths[3], align: 'left' });
    doc.text(user.gender === 'M' ? "Male" : "Female", startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], rowY + verticalCenterAdjustment, { width: columnWidths[4], align: 'left' });
    doc.text(user.address || 'N/A', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], rowY + verticalCenterAdjustment, { width: columnWidths[5], align: 'left' });
    doc.rect(startX, rowY, columnWidths.reduce((a, b) => a + b), rowHeight)
  });




  return doc;
};


const exportToExcel = async () => {
  const users = await User.find({});

  const userData = users.map(user => ({
    FirstName: user.firstName,
    LastName: user.lastName,
    Email: user.email,
    PhoneNumber: user.phoneNumber,
    Role: user.role,
    Gender: user.gender == 'M' ? "Male" : "Female",
    Address: user.address || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(userData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return excelFile;
};

const deleteUserById = async (id) => {
  console.log(id);
  if (!id) {
    throw new Error('User ID is required');
  }

  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    throw new Error('User not found');
  }

  try {
    await user.deleteOne(); 
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting user');
  }
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  updateUserById,
  deleteUserById,
  exportToPDF,
  exportToExcel,
};