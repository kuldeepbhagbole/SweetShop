import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';

let mongoServer;

// Before all tests, create an in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// After all tests, stop the server and close the connection
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// After each test, clear the User collection
afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
    expect(res.body.role).toBe('user');
  });

  it('should not register a user with an existing username', async () => {
    // First, create the user
    await User.create({ username: 'testuser', password: 'password123' });

    // Then, try to register again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should log in an existing user', async () => {
    // Create user to log in
    await User.create({ username: 'loginuser', password: 'password123' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'password123',
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('loginuser');
  });

  it('should not log in with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nonexistent',
        password: 'wrongpassword',
      });
      
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});