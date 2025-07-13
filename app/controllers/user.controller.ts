
import { Service } from "typedi";
import UserService from "../services/user.service";

@Service()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async index(req: Request) {
    return { message: 'Hello from user controller' };
  }

  public async createUser(req: Request) {
    return { message: 'Hello from user controller create user' };
  }
    
  public async getUsers(req: Request) {
    const users = await this.userService.getUsers()
    return users;
  }

  sayHello() {
    console.log('hello')
  }
}