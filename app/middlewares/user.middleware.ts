import type { MiddlewareInterface } from '#core/types';
import { Service } from 'typedi';

@Service()
export default class UserMiddleware implements MiddlewareInterface {
  handle(_: Request): any {
    // your logic here
  }
}
