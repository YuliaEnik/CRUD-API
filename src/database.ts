import { Database, User } from './types';
import { v4 as uuidv4 } from 'uuid';

class InMemoryDB {
  private db: Database = { users: [] };
  private static instance: InMemoryDB;

  private constructor() {}

  static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  getAllUsers(): User[] {
    return [...this.db.users];
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find(user => user.id === id);
  }

  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: uuidv4(),
      ...userData
    };
    this.db.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, userData: Omit<User, 'id'>): User | undefined {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    const updatedUser: User = {
      id,
      ...userData
    };
    this.db.users[userIndex] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.db.users.splice(userIndex, 1);
    return true;
  }
  
  setData(newData: Database): void {
    this.db = newData;
  }

  getData(): Database {
    return this.db;
  }
}

export const db = InMemoryDB.getInstance();
