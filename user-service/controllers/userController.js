const userService = require('../services/userService');
const { exportToPDF, exportToExcel } = userService;

const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers(req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserById =  async (req, res) => {
  const { name, email, phoneNumber, role, password,status } = req.body;
  try {
    await userService.updateUserById(req.params,{ name, email, phoneNumber, role, status, password });
    res.status(201).json({ message: 'User Updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserById(id);
    res.status(200).json(result);  // Successfully deleted user
  } catch (error) {
    res.status(400).json({ message: error.message });  // Error occurred
  }
};

const createUser = async (req, res) => {
  const { name, email, phoneNumber, role, password,status } = req.body;

  try {
    await userService.createUser({ name, email, phoneNumber, role, status, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    const data = await userService.getUsersById(req.params);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportUsersToPDF = async (req, res) => {
  try {
    const doc = await exportToPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to export data to PDF' });
  }
};
  
  const exportUsersToExcel = async (req, res) => {
    try {
      const excelFile = await exportToExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      res.send(excelFile); 
    } catch (error) {
      res.status(500).json({ message: 'Failed to export data to Excel' });
    }
  };

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  exportUsersToPDF,
  updateUserById,
  deleteUserById,
  exportUsersToExcel
};