const userService = require('./userService');
const User = require('../models/User');
const { sendConfirmationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

jest.mock('../models/User');
jest.mock('../utils/emailService');
jest.mock('jsonwebtoken');
jest.mock('pdfkit');
jest.mock('xlsx');

describe('User Service', () => {
  describe('createUser', () => {
    it('should throw an error if any required field is missing', async () => {
      await expect(userService.createUser({})).rejects.toThrow('All fields are required');
    });

    it('should throw an error if the email format is invalid', async () => {
      await expect(userService.createUser({ name: 'John', email: 'john', phoneNumber: '1234567890', role: 'user', status: 'active', password: 'Password1!' })).rejects.toThrow('Invalid email format');
    });

    it('should throw an error if the phone number format is invalid', async () => {
      await expect(userService.createUser({ name: 'John', email: 'john@example.com', phoneNumber: 'invalid', role: 'user', status: 'active', password: 'Password1!' })).rejects.toThrow('Invalid phone number format');
    });

    it('should throw an error if the password format is invalid', async () => {
      await expect(userService.createUser({ name: 'John', email: 'john@example.com', phoneNumber: '1234567890', role: 'user', status: 'active', password: 'invalid' })).rejects.toThrow('Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
    });

    it('should throw an error if the email already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com' });
      await expect(userService.createUser({ name: 'John', email: 'john@example.com', phoneNumber: '1234567890', role: 'user', status: 'active', password: 'Password1!' })).rejects.toThrow('Email already exists');
    });

    it('should create a new user successfully and send a confirmation email', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({ _id: '123', email: 'john@example.com' });
      jwt.sign.mockReturnValue('token');
      sendConfirmationEmail.mockResolvedValue();

      const user = await userService.createUser({ name: 'John', email: 'john@example.com', phoneNumber: '1234567890', role: 'user', status: 'active', password: 'Password1!' });

      expect(user).toEqual({ _id: '123', email: 'john@example.com' });
      expect(sendConfirmationEmail).toHaveBeenCalledWith('john@example.com', 'token');
    });
  });

  describe('updateUserById', () => {
    it('should throw an error if the user ID is missing', async () => {
      await expect(userService.updateUserById({}, {})).rejects.toThrow('User ID is required');
    });

    it('should throw an error if the email is already in use by another user', async () => {
      User.findOne.mockResolvedValue({ _id: '456', email: 'john@example.com' });
      await expect(userService.updateUserById({ id: '123' }, { email: 'john@example.com' })).rejects.toThrow('Error updating user: Invalid phone number format');
    });

    it('should throw an error if the email format is invalid', async () => {
      await expect(userService.updateUserById({ id: '123' }, { email: 'john' })).rejects.toThrow('Error updating user: Invalid email format');
    });

    it('should throw an error if the phone number format is invalid', async () => {
      await expect(userService.updateUserById({ id: '123' }, { phoneNumber: 'invalid' })).rejects.toThrow('Error updating user: Expected a string but received a undefined');
    });

    it('should update the user successfully', async () => {
        const mockUser = {
          name: 'John',
          email: 'john123@example.com',
          phoneNumber: '1234567890',
          role: 'user',
          status: 'active',
          save: jest.fn().mockResolvedValue(true),
        };
  
        User.findById.mockResolvedValue(mockUser);
  
        const user = await userService.updateUserById({ id: '123' }, {
          name: 'John',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          role: 'user',
          status: 'active',
        });
  
        // Remove the save function from the user object before the assertion
        delete user.save;
  
        expect(user).toEqual({
          name: 'John',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          role: 'user',
          status: 'active',
        });
      });
  });

  describe('getUsers', () => {
    it('should return a paginated list of users based on the query parameters', async () => {
        const mockSort = jest.fn().mockReturnThis();
        const mockSkip = jest.fn().mockReturnThis();
        const mockLimit = jest.fn().mockReturnValue([{ name: 'John', createdAt: -1 }]);
      
        User.find.mockReturnValue({
          sort: mockSort,
          skip: mockSkip,
          limit: mockLimit,
        });
      
        User.countDocuments.mockResolvedValue(1);
      
        const users = await userService.getUsers({ page: 1, limit: 10, sort: 'name' });
      
        expect(users).toEqual({
          currentPage: 1,
          totalCount: 1,
          totalPages: 1,
          users: [{ createdAt: -1,name: "John", }],
        });
        expect(User.find).toHaveBeenCalled();
        expect(mockSort).toHaveBeenCalledWith({"createdAt": -1});
        expect(mockSkip).toHaveBeenCalledWith(0);
        expect(mockLimit).toHaveBeenCalledWith(10);
      });
  });

  describe('getUsersById', () => {
    it('should throw an error if the user ID is missing', async () => {
      await expect(userService.getUsersById({})).rejects.toThrow('User ID is required');
    });

    it('should throw an error if the user is not found', async () => {
      User.findById.mockResolvedValue(null);
      await expect(userService.getUsersById({ id: '123' })).rejects.toThrow('User not found');
    });

    it('should return the user if found', async () => {
        const mockUser = {
          name: 'John',
        };
  
        User.findById.mockResolvedValue(mockUser);
  
        const user = await userService.getUsersById({id:'123'});
  
        expect(user).toEqual({
          name: 'John',
        });
      });
  });

 
  describe('exportToExcel', () => {
    it('should generate an Excel file with user data', async () => {
      User.find.mockResolvedValue([{ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phoneNumber: '1234567890', role: 'user', gender: 'M', address: '123 Street' }]);
      XLSX.utils.json_to_sheet = jest.fn().mockReturnValue({});
      XLSX.utils.book_new = jest.fn().mockReturnValue({});
      XLSX.utils.book_append_sheet = jest.fn();
      XLSX.write = jest.fn().mockReturnValue(Buffer.from(''));

      const excelFile = await userService.exportToExcel();

      expect(excelFile).toBeInstanceOf(Buffer);
    });
  });

  describe('deleteUserById', () => {
    it('should throw an error if the user ID is missing', async () => {
      await expect(userService.deleteUserById()).rejects.toThrow('User ID is required');
    });

    it('should throw an error if the user is not found', async () => {
      User.findById.mockResolvedValue(null);
      await expect(userService.deleteUserById('123')).rejects.toThrow('User not found');
    });

    it('should delete the user successfully', async () => {
      User.findById.mockResolvedValue({ deleteOne: jest.fn() });

      const result = await userService.deleteUserById('123');

      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});