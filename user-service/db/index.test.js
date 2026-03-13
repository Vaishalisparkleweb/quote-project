const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('./index');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Database connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri().replace(/\/$/, "");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should connect to the database and perform operations', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await connectDB();
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB URI:', process.env.MONGO_URI);
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected');

    const testCollection = mongoose.connection.db.collection('users');
    const insertedDoc = await testCollection.findOne({ message: 'Database created!' });
    expect(insertedDoc).toBeNull();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle connection errors', async () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    process.env.MONGO_URI = 'invalid_uri';
    await connectDB();

    expect(processExitSpy).toHaveBeenCalledWith(1);

    processExitSpy.mockRestore();
  });
});