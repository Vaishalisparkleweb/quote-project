const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');
const userService = require('../services/userService');

jest.mock('../services/userService');

const app = express();
app.use(express.json());

app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUsersById);
app.post('/users', userController.createUser);
app.put('/users/:id', userController.updateUserById);
app.delete('/users/:id', userController.deleteUserById);
app.get('/users/export-pdf', userController.exportUsersToPDF);
app.get('/users/export-excel', userController.exportUsersToExcel);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users - success', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    userService.getUsers.mockResolvedValue(mockData);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('GET /users - failure', async () => {
    userService.getUsers.mockRejectedValue(new Error('Failed to get users'));

    const response = await request(app).get('/users');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to get users' });
  });

  test('GET /users/:id - success', async () => {
    const mockData = { id: 1, name: 'John Doe' };
    userService.getUsersById.mockResolvedValue(mockData);

    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('GET /users/:id - failure', async () => {
    userService.getUsersById.mockRejectedValue(new Error('Failed to get user by ID'));

    const response = await request(app).get('/users/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to get user by ID' });
  });

  test('POST /users - success', async () => {
    userService.createUser.mockResolvedValue();

    const response = await request(app).post('/users').send({ name: 'John Doe', email: 'john@example.com' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  test('POST /users - failure', async () => {
    userService.createUser.mockRejectedValue(new Error('Failed to create user'));

    const response = await request(app).post('/users').send({ name: 'John Doe', email: 'john@example.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to create user' });
  });

  test('PUT /users/:id - success', async () => {
    userService.updateUserById.mockResolvedValue();

    const response = await request(app).put('/users/1').send({ name: 'John Doe' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User Updated successfully' });
  });

  test('PUT /users/:id - failure', async () => {
    userService.updateUserById.mockRejectedValue(new Error('Failed to update user'));

    const response = await request(app).put('/users/1').send({ name: 'John Doe' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to update user' });
  });

  test('DELETE /users/:id - success', async () => {
    userService.deleteUserById.mockResolvedValue({ message: 'User deleted successfully' });

    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });

  test('DELETE /users/:id - failure', async () => {
    userService.deleteUserById.mockRejectedValue(new Error('Failed to delete user'));

    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to delete user' });
  });

  test('GET /users/export-pdf - success', async () => {
    const mockPDF = Buffer.from('PDF content');
    userService.exportToPDF.mockResolvedValue(mockPDF);

    const response = await request(app).get('/users/export-pdf');
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  });

  test('GET /users/export-pdf - failure', async () => {
    userService.exportToPDF.mockRejectedValue(new Error('Failed to get user by ID'));

    const response = await request(app).get('/users/export-pdf');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to get user by ID' });
  });

  test('GET /users/export-excel - success', async () => {
    const mockExcel = Buffer.from('Excel content');
    userService.exportToExcel.mockResolvedValue(mockExcel);

    const response = await request(app).get('/users/export-excel');
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  });

  test('GET /users/export-excel - failure', async () => {
    userService.exportToExcel.mockRejectedValue(new Error('Failed to get user by ID'));

    const response = await request(app).get('/users/export-excel');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to get user by ID' });
  });
});