import request from 'supertest';
import app from '../index.js';
import User from '../models/user.js';
import Exercise from '../models/exercise.js';

describe('Logs API', () => {
  let user;

  beforeEach(async () => {
    // Clear users and exercises collections before each test
    await User.deleteMany({});
    await Exercise.deleteMany({});

    user = await User.create({ username: 'testuser' });
  });

  describe('GET /api/users/:id/logs', () => {
    it('should retrieve exercise logs for a user', async () => {
      const exercise1 = await request(app)
        .post(`/api/users/${user._id}/exercises`)
        .send({
          user: user._id,
          description: 'Exercise 1',
          duration: 30,
        });

      const exercise2 = await request(app)
        .post(`/api/users/${user._id}/exercises`)
        .send({
          user: user._id,
          description: 'Exercise 2',
          duration: 45,
        });

      const response = await request(app).get(`/api/users/${user._id}/logs`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('log');
      expect(response.body.log.length).toBe(2);
      expect(response.body.log[0]).toHaveProperty('description', 'Exercise 1');
      expect(response.body.log[0]).toHaveProperty('duration', 30);
      expect(response.body.log[1]).toHaveProperty('description', 'Exercise 2');
      expect(response.body.log[1]).toHaveProperty('duration', 45);
    });

    it('should filter exercise logs by date range', async () => {
      await request(app).post(`/api/users/${user._id}/exercises`).send({
        user: user._id,
        description: 'Exercise 1',
        duration: 30,
        date: '2023-01-01',
      });

      await request(app).post(`/api/users/${user._id}/exercises`).send({
        user: user._id,
        description: 'Exercise 2',
        duration: 45,
        date: '2023-02-01',
      });

      const response = await request(app)
        .get(`/api/users/${user._id}/logs`)
        .query({ from: '2023-01-15', to: '2023-02-15' });

      expect(response.status).toBe(200);
      expect(response.body.log).toHaveLength(1);
      expect(response.body.log[0]).toHaveProperty('description', 'Exercise 2');
    });

    it('should limit the number of exercise logs', async () => {
      await request(app).post(`/api/users/${user._id}/exercises`).send({
        user: user._id,
        description: 'Exercise 1',
        duration: 30,
      });

      await request(app).post(`/api/users/${user._id}/exercises`).send({
        user: user._id,
        description: 'Exercise 2',
        duration: 45,
      });

      const response = await request(app)
        .get(`/api/users/${user._id}/logs`)
        .query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body.log).toHaveLength(1);
      expect(response.body.log[0]).toHaveProperty('description', 'Exercise 1');
    });
  });
});
