import sql from '#start/sql';
import { Service } from 'typedi';
import type { User } from '#models/user.model';

@Service()
export default class UserService {
  async createUser() {
    const userData: User = {
      name: 'Alice',
      email: Date.now() + '@example.com',
      password: '123456',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const [newUser]: User[] = await sql`
      INSERT INTO users ${sql(userData)}
      RETURNING *
    `;
    return newUser;
  }

  async getUsers(): Promise<{ message: string; data: User[] }> {
    const users: User[] = await sql`
      SELECT * FROM users
      LIMIT ${1}
    `;
    return {
      message: 'Users fetched successfully',
      data: users,
    };
  }
}
