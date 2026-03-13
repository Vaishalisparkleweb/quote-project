const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./db/index');

jest.mock('./db/index');
jest.mock('./routes/authRoutes');
jest.mock('./routes/userRoutes');

describe('Express server', () => {
  let app;

  beforeAll(() => {
    connectDB.mockImplementation(() => Promise.resolve());
    authRoutes.mockImplementation(() => express.Router().get('/', (req, res) => res.sendStatus(200)));
    userRoutes.mockImplementation(() => express.Router().get('/', (req, res) => res.sendStatus(200)));

    app = express();
    connectDB();
    app.use(express.json());
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }));
    app.use('/api', authRoutes);
    app.use('/api/users', userRoutes);
  });

  it('should start the server and listen on the correct port', (done) => {
    const PORT = process.env.PORT || 4000;
    const HOST = process.env.HOST || 'localhost';
    const server = app.listen(PORT, () => {
      expect(server.address().port).toBe(parseInt(PORT));
      server.close(done);
    });
  });

  it('should set CORS headers correctly', async () => {
    const response = await request(app).options('/api');
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});