import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';

let mongoServer;
let adminToken;
let userToken;
let sweetId;

// Setup: Create in-memory server and populate with users
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // 1. Create Admin User
  await request(app).post('/api/auth/register').send({
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  });
  const adminLogin = await request(app).post('/api/auth/login').send({
    username: 'admin',
    password: 'admin123',
  });
  adminToken = adminLogin.body.token;

  // 2. Create Regular User
  await request(app).post('/api/auth/register').send({
    username: 'user',
    password: 'user123',
  });
  const userLogin = await request(app).post('/api/auth/login').send({
    username: 'user',
    password: 'user123',
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({}); // Clear sweets collection after each test
});


describe('Sweets API', () => {

  // Test 1: POST /api/sweets (Admin)
  it('should allow admin to create a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gummy Bears',
        category: 'Gummy',
        price: 2.99,
        quantity: 100,
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Gummy Bears');
    sweetId = res.body._id; // Save for other tests
  });

  // Test 2: POST /api/sweets (User) - Should Fail
  it('should FORBID user from creating a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Forbidden Candy',
        category: 'Gummy',
        price: 1.99,
        quantity: 10,
      });
      
    expect(res.statusCode).toEqual(403); // 403 Forbidden
    expect(res.body.message).toBe('Not authorized as an admin');
  });

  // Test 3: GET /api/sweets
  it('should allow user to get all sweets', async () => {
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Gummy Bears', category: 'Gummy', price: 2.99, quantity: 100,
    });
    
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Gummy Bears');
  });

  // Test 4: GET /api/sweets/search
  it('should allow user to search for sweets', async () => {
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Gummy Bears', category: 'Gummy', price: 2.99, quantity: 100,
    });
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Chocolate Bar', category: 'Chocolate', price: 1.99, quantity: 50,
    });
    
    // Search by category
    const res = await request(app)
      .get('/api/sweets/search?category=Choc')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Chocolate Bar');
  });

  // Test 5: POST /api/sweets/:id/purchase
  it('should allow user to purchase a sweet', async () => {
    const sweetRes = await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Lollipop', category: 'Hard Candy', price: 0.99, quantity: 10,
    });
    const id = sweetRes.body._id;

    const res = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.currentQuantity).toBe(9);
  });
  
  // Test 6: POST /api/sweets/:id/purchase (Out of stock)
  it('should return error when purchasing out-of-stock sweet', async () => {
    const sweetRes = await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Jawbreaker', category: 'Hard Candy', price: 3.99, quantity: 0,
    });
    const id = sweetRes.body._id;

    const res = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Out of stock');
  });

  // Test 7: POST /api/sweets/:id/restock (Admin)
  it('should allow admin to restock a sweet', async () => {
    const sweetRes = await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Sour Patch', category: 'Gummy', price: 1.50, quantity: 20,
    });
    const id = sweetRes.body._id;

    const res = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 30 });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.currentQuantity).toBe(50);
  });
  
  // Test 8: DELETE /api/sweets/:id (Admin)
  it('should allow admin to delete a sweet', async () => {
    const sweetRes = await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'To Be Deleted', category: 'Test', price: 1, quantity: 1,
    });
    const id = sweetRes.body._id;

    const res = await request(app)
      .delete(`/api/sweets/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Sweet removed');
  });
});