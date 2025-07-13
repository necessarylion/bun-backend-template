export interface MiddlewareInterface {
  handle(req: Request): any;
}