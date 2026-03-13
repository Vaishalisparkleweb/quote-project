const request = require('supertest');
const express = require('express');
const authController = require('../controllers/authController');
const authService = require('../services/authService');

jest.mock('../services/authService');

const app = express();
app.use(express.json());

app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);
app.get('/confirm-email/:email', authController.confirmEmail);
app.post('/forgot-password', authController.forgotPassword);
app.post('/reset-password', authController.resetPassword);
app.post('/change-password', authController.changePassword);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /register - success', async () => {
    authService.registerUser.mockResolvedValue();

    const response = await request(app).post('/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      role: 'user',
      password: 'password123',
      status: 'active'
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  test('POST /register - failure', async () => {
    authService.registerUser.mockRejectedValue(new Error('Failed to register user'));

    const response = await request(app).post('/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      role: 'user',
      password: 'password123',
      status: 'active'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to register user' });
  });

  test('POST /login - success', async () => {
    const mockData = { token: 'fakeToken', user: { id: 1, name: 'John Doe' } };
    authService.loginUser.mockResolvedValue(mockData);

    const response = await request(app).post('/login').send({
      email: 'john@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Login successful', token: 'fakeToken' });
  });

  test('POST /login - failure', async () => {
    authService.loginUser.mockRejectedValue(new Error('Failed to login'));

    const response = await request(app).post('/login').send({
      email: 'john@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to login' });
  });

  test('GET /confirm-email/:email - success', async () => {
    const mockData = { message: 'Email confirmed' };
    authService.confirmEmail.mockResolvedValue(mockData);

    const response = await request(app).get('/confirm-email/john@example.com');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('GET /confirm-email/:email - failure', async () => {
    authService.confirmEmail.mockRejectedValue(new Error('Failed to confirm email'));

    const response = await request(app).get('/confirm-email/john@example.com');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to confirm email' });
  });

  test('POST /forgot-password - success', async () => {
    const mockData = { message: 'Password reset link sent' };
    authService.forgotPassword.mockResolvedValue(mockData);

    const response = await request(app).post('/forgot-password').send({
      email: 'john@example.com'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('POST /forgot-password - failure', async () => {
    authService.forgotPassword.mockRejectedValue(new Error('Failed to send password reset link'));

    const response = await request(app).post('/forgot-password').send({
      email: 'john@example.com'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to send password reset link' });
  });

  test('POST /reset-password - success', async () => {
    const mockData = { message: 'Password reset successful' };
    authService.resetPassword.mockResolvedValue(mockData);

    const response = await request(app).post('/reset-password').send({
      newPassword: 'newPassword123'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('POST /reset-password - failure', async () => {
    authService.resetPassword.mockRejectedValue(new Error('Failed to reset password'));

    const response = await request(app).post('/reset-password').send({
      newPassword: 'newPassword123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to reset password' });
  });

  test('POST /change-password - success', async () => {
    const mockData = { message: 'Password changed successfully' };
    authService.changePassword.mockResolvedValue(mockData);

    const response = await request(app).post('/change-password').send({
      email: 'john@example.com',
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('POST /change-password - failure', async () => {
    authService.changePassword.mockRejectedValue(new Error('Failed to change password'));

    const response = await request(app).post('/change-password').send({
      email: 'john@example.com',
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Failed to change password' });
  });
});