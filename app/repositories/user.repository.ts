import type { User } from '#models/user.model';
import sql from '#start/sql';
import { Service } from 'typedi';

@Service()
export default class UserRepository {
  async createUser(user: User): Promise<User> {
    const [newUser]: User[] = await sql`
      INSERT INTO users ${sql(user)}
      RETURNING *
    `;
    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const [updatedUser]: User[] = await sql`
      UPDATE users SET ${sql(user)}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updatedUser) throw new Error('Failed to update user');
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await sql`
      SELECT * FROM users
    `;
    return users;
  }
}