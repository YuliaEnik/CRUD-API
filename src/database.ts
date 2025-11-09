import { Database, User } from './types';

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

  private generateId(): string {
    return crypto.randomUUID();
  }

  getAllUsers(): User[] {
    return [...this.db.users];
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find(user => user.id === id);
  }

  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.generateId(),
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

