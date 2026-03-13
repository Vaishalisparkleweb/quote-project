const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

describe('verifyToken Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if authorization header is missing', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Access denied' });
  });

  test('should return 401 if authorization header does not start with Bearer', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Token invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Access denied' });
  });

  test('should return 401 if token is invalid', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid token.' });
  });

  test('should call next and set req.user if token is valid', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    jwt.verify.mockImplementation(() => mockUser);

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer validtoken');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Access granted', user: mockUser });
  });
});