// Handler type that accepts any class and a string
export type FunctionRequest = (req: Request) => any;

// controller type
export type TupleController = [new (...args: any[]) => any, string];
export type Controller = TupleController | FunctionRequest;

// middleware type
export type ClassMiddleware = new (...args: any[]) => any;
export type Middleware = ClassMiddleware | FunctionRequest;

export interface MiddlewareInterface {
  handle(req: Request): any;
}

export interface RouteItem {
  path: string;
  method: string;
  middlewares: Middleware[];
  controller: Controller;
}