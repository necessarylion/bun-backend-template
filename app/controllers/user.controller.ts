import { Service } from 'typedi';
import UserService from '../services/user.service';
import vine from '@vinejs/vine';
import Exception from '#core/exception/exception';

@Service()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async index(req: Request) {
    const schema = vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(8).maxLength(32),
    });
    const payload = await req.validate(schema);
    return payload;
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
