const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./User');
const bcrypt = require('bcryptjs');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User model', () => {
  it('should hash the password before saving', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      role: 'User',
      password: 'password123',
      status: true,
    });

    await user.save();
    expect(user.password).not.toBe('password123');
    const isMatch = await bcrypt.compare('password123', user.password);
    expect(isMatch).toBe(true);
  });

  it('should not hash the password if it is not modified', async () => {
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      role: 'Admin',
      password: 'password123',
      status: true,
    });

    await user.save();
    const originalPasswordHash = user.password;

    user.name = 'Jane Smith';
    await user.save();

    expect(user.password).toBe(originalPasswordHash);
  });

  it('should compare passwords correctly', async () => {
    const user = new User({
      name: 'Alice',
      email: 'alice@example.com',
      phoneNumber: '1112223333',
      role: 'Super Admin',
      password: 'password123',
      status: true,
    });

    await user.save();

    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should require unique email and phone number', async () => {
    const user1 = new User({
      name: 'Bob',
      email: 'bob@example.com',
      phoneNumber: '4445556666',
      role: 'User',
      password: 'password123',
      status: true,
    });

    await user1.save();

    const user2 = new User({
      name: 'Bob Jr.',
      email: 'bob@example.com',
      phoneNumber: '7778889999',
      role: 'User',
      password: 'password123',
      status: true,
    });

    await expect(user2.save()).rejects.toThrow();

    const user3 = new User({
      name: 'Bob Sr.',
      email: 'bob.sr@example.com',
      phoneNumber: '4445556666',
      role: 'User',
      password: 'password123',
      status: true,
    });

    await expect(user3.save()).rejects.toThrow();
  });
});