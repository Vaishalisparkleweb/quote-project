const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const { getUsers, exportUsersToExcel, exportUsersToPDF, getUsersById, createUser, updateUserById, deleteUserById } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// Mock the controller functions and middleware
jest.mock('../controllers/userController');
jest.mock('../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users should call getUsers', async () => {
    getUsers.mockImplementation((req, res) => res.status(200).send('Users retrieved'));
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Users retrieved');
    expect(getUsers).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalled();
  });

  test('POST /users should call createUser', async () => {
    createUser.mockImplementation((req, res) => res.status(201).send('User created'));
    const response = await request(app).post('/users').send({ name: 'test', email: 'test@example.com' });
    expect(response.status).toBe(201);
    expect(response.text).toBe('User created');
    expect(createUser).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalled();
  });

  test('PUT /users/:id should call updateUserById', async () => {
    updateUserById.mockImplementation((req, res) => res.status(200).send('User updated'));
    const response = await request(app).put('/users/1').send({ name: 'updated name' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('User updated');
    expect(updateUserById).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalled();
  });

  test('DELETE /users/:id should call deleteUserById', async () => {
    deleteUserById.mockImplementation((req, res) => res.status(200).send('User deleted'));
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
    expect(response.text).toBe('User deleted');
    expect(deleteUserById).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalled();
  });

  test('GET /users/:id should call getUsersById', async () => {
    getUsersById.mockImplementation((req, res) => res.status(200).send('User retrieved by ID'));
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.text).toBe('User retrieved by ID');
    expect(getUsersById).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalled();
  });

  test('GET /users/export-pdf should call exportUsersToPDF and return a file buffer', async () => {
    const fileBuffer = Buffer.from('PDF file content');
    exportUsersToPDF.mockImplementation((req, res) => {
      res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(fileBuffer);
    });
    const response = await request(app).get('/users/export-pdf');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(verifyToken).toHaveBeenCalled();
  });

  test('GET /users/export-excel should call exportUsersToExcel and return a file buffer', async () => {
    const fileBuffer = Buffer.from('Excel file content');
    exportUsersToExcel.mockImplementation((req, res) => {
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(fileBuffer);
    });
    const response = await request(app).get('/users/export-excel');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(verifyToken).toHaveBeenCalled();
  });
});