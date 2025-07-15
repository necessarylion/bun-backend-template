import { Service } from 'typedi';
import UserService from '../services/user.service';

@Service()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async index() {
    return { message: 'Hello from user controller' };
  }

  public async createUser() {
    return await this.userService.createUser();
  }

  public async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  sayHello() {
    console.log('hello');
  }
}
