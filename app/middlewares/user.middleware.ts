import type { MiddlewareInterface } from "#router/types";
import BlogService from "#services/blog.service";
import { Service } from "typedi";

@Service()
export default class UserMiddleware implements MiddlewareInterface {
  constructor(private service: BlogService) {}

  handle(req: Request): any {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')
    this.service.sayHello()
    if (!name) return 'Name is required';
  }
}
