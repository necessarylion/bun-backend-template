import Container from 'typedi';
import type { MiddlewareInterface } from './types';

// Handler type that accepts any class and a string
export type FunctionRequest = (req: Request) => any;

// controller type
export type TupleController = [new (...args: any[]) => any, string];
export type Controller = TupleController | FunctionRequest;

// middleware type
export type ClassMiddleware = new (...args: any[]) => any;
export type Middleware = ClassMiddleware | FunctionRequest;

export class Route {
  /**
   * The routes array
   * @type {Array}
   */
  private routes: {
    path: string;
    method: string;
    middlewares: Middleware[];
    controller: Controller;
  }[] = [];

  /**
   * The instance of the Route class
   * @type {Route}
   */
  private static instance: Route;

  /**
   * Constructor for the Route class
   * @returns The instance of the Route class
   */
  public constructor() {
    if (!Route.instance) Route.instance = this;
    return Route.instance
  }

  public middleware(middleware: Middleware) {
    const index = this.#getLastRouteIndex();
    this.routes[index]?.middlewares.push(middleware);
    return this;
  }

  /**
   * Get the last route index
   * @returns The last route index
   */
  #getLastRouteIndex(): number {
    return this.routes.length - 1;
  }

  /**
   * Register a GET route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static get(path: string, controller: Controller) {
    return Route.add(path, 'GET', controller);
  }

  /**
   * Register a POST route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static post(path: string, controller: Controller) {
    return Route.add(path, 'POST', controller);
  }

  /**
   * Register a PUT route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static put(path: string, controller: Controller) {
    return Route.add(path, 'PUT', controller);
  }

  /**
   * Register a DELETE route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static delete(path: string, controller: Controller) {
    return Route.add(path, 'DELETE', controller);
  }

  /**
   * Register a PATCH route
   * @param path - The path of the route
   * @param controller - The controller function
   */
  public static patch(path: string, controller: Controller) {
    return Route.add(path, 'PATCH', controller);
  }

  /**
   * Register a ALL route
   * @param path - The path of the route
   * @param controller - The controller function
   */
  public static all(path: string, controller: Controller) {
    return Route.add(path, 'ALL', controller);
  }

  /**
   * Register a OPTIONS route
   * @param path - The path of the route
   * @param controller - The controller function
   */
  public static options(path: string, controller: Controller) {
    return Route.add(path, 'OPTIONS', controller);
  }

  /**
   * Add a route to the router
   * @param path - The path of the route
   * @param method - The method of the route
   * @param controller - The controller function
   */
  public static add(path: string, method: string, controller: Controller) {
    const routerInstance = new Route();
    routerInstance.routes.push({ path, method, controller, middlewares: [] });
    return routerInstance;
  }

  /**
  * Get all registered routes
  * @returns A record of routes
  */
  public static list() {
    const records: Record<string, any> = {}
    const routerInstance = new Route();
    for (const { controller, path, method, middlewares } of routerInstance.routes) {

      // setting the object for path
      // eg 
      // {
      //   '/users': {}
      // }
      if (!records[path]) records[path] = {}

      // getting the class instance using dependency injection container
      const isTuple = Array.isArray(controller)
      const classInstance: any = isTuple ? Container.get(controller[0]) : undefined;

      const mServices: Record<string, MiddlewareInterface> = {}
      for (const middleware of middlewares) {
        if (routerInstance.#isClass(middleware)) {
          const service = Container.get(middleware)
          mServices[middleware.name] = service
        }
      }

      // assign the controller to the route path
      records[path][method] = async (req: Request) => {
        // run the middlewares
        for (const middleware of middlewares) {
          let mRes: any = undefined
          if (routerInstance.#isClass(middleware)) {
            mRes = await mServices[middleware.name]?.handle(req)
          } else {
            mRes = await middleware(req)
          }
          // if middleware returns a response, return it
          if (mRes) return routerInstance.#parseResponse(mRes)
        }
        // if controller is a tuple, get the class instance and call the method
        // else call the controller function
        // tuple controller eg. [UserController, 'index']
        // function controller eg. (req: Request) => any
        const res = isTuple
          ? await classInstance[controller[1]](req)
          : await controller(req)
        return routerInstance.#parseResponse(res)
      }
    }
    return records;
  }

  #parseResponse(res: any) {
    // if already response object, return it
    if (res instanceof Response) return res
    // if object, return json response
    if (res instanceof Object) return Response.json(res)
    // else return string response
    return new Response(res)
  }

  // Helper function to check if a value is a class constructor
  #isClass(v: any): v is new (...args: any[]) => any {
    return (
      typeof v === "function" &&
      /^class\s/.test(v.toString()) // Check if the function is a class
    );
  }
}