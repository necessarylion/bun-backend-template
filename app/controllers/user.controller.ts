import { Service } from 'typedi';
import UserService from '../services/user.service';
import { vUserCreate } from '#validators/user.validator';

@Service()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async index() {
    return await this.userService.listing();
  }

  public async create(req: Request) {
    const payload = await req.validate(vUserCreate);
    return await this.userService.create(payload);
  }

  public async update(req: Request) {
    const payload = await req.validate(vUserCreate);
    return await this.userService.update(Number(req.params.id), payload);
  }

  public async destroy(req: Request) {
    return await this.userService.delete(Number(req.params.id));
  }
}
