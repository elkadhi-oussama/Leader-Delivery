const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Increase timeout for all tests
jest.setTimeout(30000);

// MongoDB Atlas connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://test:test123@cluster0.mongodb.net/ecommerce_test?retryWrites=true&w=majority';

// Test data
const adminUser = {
  name: 'Admin User',
  email: 'admin@test.com',
  password: 'password123',
  role: 'admin'
};

const regularUser = {
  name: 'Regular User',
  email: 'user@test.com',
  password: 'password123'
};

const testProduct = {
  name: 'Test Product',
  price: 99.99,
  description: 'Test Description',
  image: 'test.jpg',
  brand: 'Test Brand',
  category: 'Test Category',
  countInStock: 10
};

const testOrder = {
  orderItems: [
    {
      name: 'Test Product',
      quantity: 1,
      image: 'test.jpg',
      price: 99.99,
      product: null // Will be set after product creation
    }
  ],
  shippingAddress: {
    street: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'Test Country'
  },
  paymentMethod: 'credit_card',
  totalPrice: 99.99
};

let adminToken;
let userToken;
let testProductId;
let testOrderId;

// Setup and Teardown
beforeAll(async () => {
  try {
    // Connect to test database with options
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
    });

    // Clear all collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
});

// Auth Tests
describe('Auth Endpoints', () => {
  test('Register Admin User', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(adminUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  test('Register Regular User', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(regularUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  test('Login User', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: regularUser.email,
        password: regularUser.password
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

// Product Tests
describe('Product Endpoints', () => {
  test('Create Product (Admin)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testProduct);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(testProduct.name);
    testProductId = res.body._id;
    testOrder.orderItems[0].product = testProductId;
  });

  test('Get All Products', async () => {
    const res = await request(app)
      .get('/api/products');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.products)).toBeTruthy();
  });

  test('Get Product by ID', async () => {
    const res = await request(app)
      .get(`/api/products/${testProductId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testProduct.name);
  });
});

// Order Tests
describe('Order Endpoints', () => {
  test('Create Order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(testOrder);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.orderItems[0].name).toBe(testOrder.orderItems[0].name);
    testOrderId = res.body._id;
  });

  test('Get User Orders', async () => {
    const res = await request(app)
      .get('/api/orders/myorders')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('Update Order Status (Admin)', async () => {
    const res = await request(app)
      .put(`/api/orders/${testOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('processing');
  });
});

// User Management Tests
describe('User Management Endpoints', () => {
  test('Get All Users (Admin)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('Update User Profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Updated Name',
        phone: '1234567890'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });
}); 