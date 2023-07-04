import request from 'supertest';
import app from '../index.js';
import User from '../models/user.js';

describe('User API', () => {
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should return an error for invalid input', async () => {
      const response = await request(app).post('/api/users').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users', () => {
    it('should retrieve all users', async () => {
      await User.create({ username: 'user1' });
      await User.create({ username: 'user2' });

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('username', 'user1');
      expect(response.body[1]).toHaveProperty('_id');
      expect(response.body[1]).toHaveProperty('username', 'user2');
    });
  });
});
