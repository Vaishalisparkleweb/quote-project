const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { registerUser, loginUser, confirmEmail, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');

// Mock the controller functions
jest.mock('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/register should call only registerUser', async () => {
    registerUser.mockImplementation((req, res) => res.status(201).send('User registered'));
    const response = await request(app).post('/auth/register').send({ username: 'test', password: 'test' });
    expect(response.status).toBe(201);
    expect(response.text).toBe('User registered');
    expect(registerUser).toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(resetPassword).not.toHaveBeenCalled();
    expect(changePassword).not.toHaveBeenCalled();
  });

  test('POST /auth/login should call only loginUser', async () => {
    loginUser.mockImplementation((req, res) => res.status(200).send('User logged in'));
    const response = await request(app).post('/auth/login').send({ username: 'test', password: 'test' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('User logged in');
    expect(loginUser).toHaveBeenCalled();
    expect(registerUser).not.toHaveBeenCalled();
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(resetPassword).not.toHaveBeenCalled();
    expect(changePassword).not.toHaveBeenCalled();
  });

  test('GET /auth/confirm/:email should call only confirmEmail', async () => {
    confirmEmail.mockImplementation((req, res) => res.status(200).send('Email confirmed'));
    const response = await request(app).get('/auth/confirm/test@example.com');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Email confirmed');
    expect(confirmEmail).toHaveBeenCalled();
    expect(registerUser).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(resetPassword).not.toHaveBeenCalled();
    expect(changePassword).not.toHaveBeenCalled();
  });

  test('POST /auth/forgot-password should call only forgotPassword', async () => {
    forgotPassword.mockImplementation((req, res) => res.status(200).send('Password reset link sent'));
    const response = await request(app).post('/auth/forgot-password').send({ email: 'test@example.com' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Password reset link sent');
    expect(forgotPassword).toHaveBeenCalled();
    expect(registerUser).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(resetPassword).not.toHaveBeenCalled();
    expect(changePassword).not.toHaveBeenCalled();
  });

  test('POST /auth/reset-password should call only resetPassword', async () => {
    resetPassword.mockImplementation((req, res) => res.status(200).send('Password reset'));
    const response = await request(app).post('/auth/reset-password').send({ token: 'testtoken', newPassword: 'newpassword' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Password reset');
    expect(resetPassword).toHaveBeenCalled();
    expect(registerUser).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(changePassword).not.toHaveBeenCalled();
  });

  test('POST /auth/change-password should call only changePassword', async () => {
    changePassword.mockImplementation((req, res) => res.status(200).send('Password changed'));
    const response = await request(app).post('/auth/change-password').send({ oldPassword: 'oldpassword', newPassword: 'newpassword' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Password changed');
    expect(changePassword).toHaveBeenCalled();
    expect(registerUser).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(resetPassword).not.toHaveBeenCalled();
  });
});