import request from 'supertest';
import app from '../index.js';
import User from '../models/user.js';
import Exercise from '../models/exercise.js';

describe('Exercise API', () => {
  let user;

  beforeEach(async () => {
    // Clear users and exercises collections before each test
    await User.deleteMany({});
    await Exercise.deleteMany({});

    user = await User.create({ username: 'testuser' });
  });

  describe('POST /api/users/:id/exercises', () => {
    it('should create a new exercise for a user', async () => {
      const response = await request(app)
        .post(`/api/users/${user._id}/exercises`)
        .send({
          description: 'Test exercise',
          duration: 60,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('description', 'Test exercise');
      expect(response.body).toHaveProperty('duration', 60);
      expect(response.body).toHaveProperty('date');
    });

    it('should return an error for invalid input', async () => {
      const response = await request(app)
        .post(`/api/users/${user._id}/exercises`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
