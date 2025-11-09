import { db } from '../database';

describe('InMemory Database Unit Tests', () => {
  beforeEach(() => {
    const emptyDB = { users: [] };
    db.setData(emptyDB);
  });

  describe('User operations', () => {
    test('should create and retrieve user', () => {
      const userData = {
        username: 'Test User',
        age: 25,
        hobbies: ['testing']
      };

      const user = db.createUser(userData);
      
      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.age).toBe(userData.age);
      expect(user.hobbies).toEqual(userData.hobbies);

      const retrievedUser = db.getUserById(user.id);
      expect(retrievedUser).toEqual(user);
    });

    test('should return undefined for non-existent user', () => {
      const user = db.getUserById('non-existent-id');
      expect(user).toBeUndefined();
    });

    test('should update user', () => {
      const user = db.createUser({
        username: 'Old Name',
        age: 20,
        hobbies: ['old hobby']
      });

      const updatedData = {
        username: 'New Name',
        age: 21,
        hobbies: ['new hobby']
      };

      const updatedUser = db.updateUser(user.id, updatedData);
      
      expect(updatedUser).toBeDefined();
      if (updatedUser) {
        expect(updatedUser.username).toBe(updatedData.username);
        expect(updatedUser.age).toBe(updatedData.age);
        expect(updatedUser.hobbies).toEqual(updatedData.hobbies);
        expect(updatedUser.id).toBe(user.id);
      }
    });

    test('should return undefined when updating non-existent user', () => {
      const updatedUser = db.updateUser('non-existent-id', {
        username: 'Test',
        age: 30,
        hobbies: []
      });

      expect(updatedUser).toBeUndefined();
    });

    test('should delete user', () => {
      const user = db.createUser({
        username: 'To Delete',
        age: 30,
        hobbies: []
      });

      const deleteResult = db.deleteUser(user.id);
      expect(deleteResult).toBe(true);

      const retrievedUser = db.getUserById(user.id);
      expect(retrievedUser).toBeUndefined();
    });

    test('should return false when deleting non-existent user', () => {
      const deleteResult = db.deleteUser('non-existent-id');
      expect(deleteResult).toBe(false);
    });

    test('should get all users', () => {
      const user1 = db.createUser({ username: 'User1', age: 20, hobbies: [] });
      const user2 = db.createUser({ username: 'User2', age: 25, hobbies: [] });

      const allUsers = db.getAllUsers();
      
      expect(allUsers).toHaveLength(2);
      expect(allUsers).toContainEqual(user1);
      expect(allUsers).toContainEqual(user2);
    });
  });
});
