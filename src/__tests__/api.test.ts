import request from 'supertest';
import app from '../app';

describe('CRUD API Integration Tests', () => {
  let createdUserId: string;

  describe('Scenario 1: Complete CRUD lifecycle', () => {
    test('1. GET /api/users should return empty array initially', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('2. POST /api/users should create a new user', async () => {
      const userData = {
        username: 'John Doe',
        age: 30,
        hobbies: ['reading', 'swimming']
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(userData);
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('string');

      createdUserId = response.body.id;
    });

    test('3. GET /api/users/{userId} should return created user', async () => {
      const response = await request(app).get(`/api/users/${createdUserId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdUserId);
      expect(response.body.username).toBe('John Doe');
    });

    test('4. PUT /api/users/{userId} should update the user', async () => {
      const updatedData = {
        username: 'John Smith',
        age: 31,
        hobbies: ['reading', 'cycling', 'gaming']
      };

      const response = await request(app)
        .put(`/api/users/${createdUserId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedData);
      expect(response.body.id).toBe(createdUserId);
    });

    test('5. DELETE /api/users/{userId} should delete the user', async () => {
      const response = await request(app).delete(`/api/users/${createdUserId}`);
      expect(response.status).toBe(204);
    });

    test('6. GET /api/users/{userId} should return 404 for deleted user', async () => {
      const response = await request(app).get(`/api/users/${createdUserId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('Scenario 2: Error handling', () => {
    test('GET /api/users/invalid-uuid should return 400 for invalid UUID', async () => {
      const response = await request(app).get('/api/users/invalid-uuid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/users with invalid data should return 400', async () => {
      const invalidData = {
        username: 'John'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('PUT /api/users/non-existent-id should return 404', async () => {
      const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const userData = {
        username: 'Test',
        age: 25,
        hobbies: ['test']
      };

      const response = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .send(userData);

      expect(response.status).toBe(404);
    });
  });
});
