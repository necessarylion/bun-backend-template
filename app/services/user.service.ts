import { Service } from 'typedi';
import UserRepository from '#repositories/user.repository';
import type { User } from '#models/user.model';
import type { VUserCreate } from '#validators/user.validator';

@Service()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(payload: VUserCreate) {
    const userData: User = {
      ...payload,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return this.userRepository.createUser(userData);
  }

  async update(id: number, userData: Partial<User>) {
    return this.userRepository.updateUser(id, userData);
  }

  async delete(id: number) {
    return this.userRepository.deleteUser(id);
  }

  async listing() {
    return await this.userRepository.getUsers();
  }
}
