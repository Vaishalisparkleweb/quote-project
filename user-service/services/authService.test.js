const authService = require('./authService');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');
jest.mock('../utils/emailService');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('authService', () => {
  describe('registerUser', () => {
    it('should throw an error if any required field is missing', async () => {
      await expect(authService.registerUser({})).rejects.toThrow('All fields are required');
    });



    it('should throw an error if the phone number format is invalid', async () => {
      await expect(authService.registerUser({
        name: 'Test',
        email: 'test@test.com',
        phoneNumber: '895',
        role: 'user',
        status: 'active',
        password: 'Kaushik@123'
      })).rejects.toThrow('Invalid phone number format');
    });

    it('should throw an error if the password format is invalid', async () => {
      await expect(authService.registerUser({
        name: 'Test',
        email: 'test@test.com',
        phoneNumber: '1234567890',
        role: 'user',
        status: 'active',
        password: '123'
      })).rejects.toThrow('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
    });



    it('should throw an error if the email format is invalid', async () => {
      await expect(authService.registerUser({
        name: 'Test',
        email: 'test',
        phoneNumber: '1234567890',
        role: 'user',
        status: 'active',
        password: 'Password1!',
      })).rejects.toThrow('Invalid email format');
    });

    it('should register a new user successfully and send a confirmation email', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({ _id: '123' });
      jwt.sign.mockReturnValue('token');
      emailService.sendConfirmationEmail.mockResolvedValue();

      const result = await authService.registerUser({
        name: 'Test',
        email: 'test@test.com',
        phoneNumber: '1234567890',
        role: 'user',
        status: 'active',
        password: 'Password1!',
      });

      expect(result).toEqual({ _id: '123' });
      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith('test@test.com', 'token');
    });

    it('should throw an error if the email already exists', async () => {
      User.findOne.mockResolvedValue(true);
      await expect(authService.registerUser({
        name: 'Test',
        email: 'test@test.com',
        phoneNumber: '1234567890',
        role: 'user',
        status: 'active',
        password: 'Password1!',
      })).rejects.toThrow('Email already exists');
    });
  });

  describe('loginUser', () => {
    it('should throw an error if email or password is missing', async () => {
      await expect(authService.loginUser()).rejects.toThrow('Email and password are required');
    });

    it('should throw an error if the email is not registered', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.loginUser('test@test.com', 'password')).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if the password is incorrect', async () => {
      User.findOne.mockResolvedValue({ comparePassword: jest.fn().mockResolvedValue(false) });
      await expect(authService.loginUser('test@test.com', 'password')).rejects.toThrow('Invalid email or password');
    });

    it('should login successfully and return a token', async () => {
      User.findOne.mockResolvedValue({ _id: '123', comparePassword: jest.fn().mockResolvedValue(true) });
      jwt.sign.mockReturnValue('token');

      const result = await authService.loginUser('test@test.com', 'password');

      expect(result).toEqual({ token: 'token', user: { _id: '123', comparePassword: expect.any(Function) } });
    });
  });

  describe('confirmEmail', () => {
    it('should throw an error if the email format is invalid', async () => {
      await expect(authService.confirmEmail('invalid')).rejects.toThrow('Invalid email format');
    });

    it('should throw an error if the user is not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.confirmEmail('test@test.com')).rejects.toThrow('User not found');
    });

    it('should confirm the email successfully', async () => {
      User.findOne.mockResolvedValue({ save: jest.fn().mockResolvedValue() });

      const result = await authService.confirmEmail('test@test.com');

      expect(result).toEqual({ message: 'Email confirmed successfully' });
    });
  });

  describe('forgotPassword', () => {
    it('should throw an error if the email format is invalid', async () => {
      await expect(authService.forgotPassword('invalid')).rejects.toThrow('Invalid email format');
    });

    it('should throw an error if the email is not registered', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.forgotPassword('test@test.com')).rejects.toThrow('Email is not registered');
    });

    it('should send a reset password email successfully', async () => {
      User.findOne.mockResolvedValue({ _id: '123' });
      jwt.sign.mockReturnValue('token');
      emailService.sendResetPasswordEmail.mockResolvedValue();

      const result = await authService.forgotPassword('test@test.com');

      expect(result).toEqual({ message: 'Reset password email sent' });
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith('test@test.com', 'token');
    });
  });

  describe('resetPassword', () => {
    it('should throw an error if the token is not provided', async () => {
      const req = { headers: {} };
      await expect(authService.resetPassword(req, 'newPassword')).rejects.toThrow('Token not provided');
    });

    it('should throw an error if the token is invalid', async () => {
      const req = { headers: { authorization: 'Bearer invalid' } };
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      await expect(authService.resetPassword(req, 'newPassword')).rejects.toThrow('Invalid token');
    });

    it('should throw an error if the user is not found', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      jwt.verify.mockReturnValue({ userId: '123' });
      User.findById.mockResolvedValue(null);
      await expect(authService.resetPassword(req, 'newPassword')).rejects.toThrow('User not found');
    });

    it('should throw an error if the new password format is invalid', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      jwt.verify.mockReturnValue({ userId: '123' });
      User.findById.mockResolvedValue({});
      await expect(authService.resetPassword(req, '123')).rejects.toThrow('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
    });

    it('should reset the password successfully', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      jwt.verify.mockReturnValue({ userId: '123' });
      User.findById.mockResolvedValue({ save: jest.fn().mockResolvedValue() });

      const result = await authService.resetPassword(req, 'Password1!');

      expect(result).toEqual({ message: 'Password reset successful' });
    });
  });

  describe('changePassword', () => {
    it('should throw an error if the email format is invalid', async () => {
      await expect(authService.changePassword('invalid', 'oldPassword', 'newPassword')).rejects.toThrow('Invalid email format');
    });

    it('should throw an error if the email is not registered', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.changePassword('test@test.com', 'oldPassword', 'newPassword')).rejects.toThrow('Email is not registered');
    });

    it('should throw an error if the old password is incorrect', async () => {
      User.findOne.mockResolvedValue({ password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.changePassword('test@test.com', 'oldPassword', 'newPassword')).rejects.toThrow('Old password is incorrect');
    });

    it('should throw an error if the new password format is invalid', async () => {
      User.findOne.mockResolvedValue({ password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      await expect(authService.changePassword('test@test.com', 'oldPassword', '123')).rejects.toThrow('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
    });

    it('should change the password successfully', async () => {
      User.findOne.mockResolvedValue({ save: jest.fn().mockResolvedValue() });
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.changePassword('test@test.com', 'oldPassword', 'Password1!');

      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });
});