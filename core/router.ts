import Container from 'typedi';
import type { Controller, Middleware, RouteItem } from './types';
import { isClass, isTuple, responseParser } from '#core/helper';

export class Router {
  /**
   * The routes array
   * @type {Array}
   */
  private routes: RouteItem[] = [];

  /**
   * The instance of the Router class
   * @type {Router}
   */
  private static instance: Router;

  /**
   * Constructor for the Router class
   * @returns The instance of the Router class
   */
  public constructor() {
    if (!Router.instance) Router.instance = this;
    return Router.instance;
  }

  /**
   * Add a middleware to the route
   * @param middleware - The middleware function
   * @returns The instance of the Route class
   */
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
   * Add a route to the router
   * @param path - The path of the route
   * @param method - The method of the route
   * @param controller - The controller function
   */
  public static registerRoute(
    path: string,
    method: string,
    controller: Controller,
    middlewares: Middleware[] = [],
  ) {
    const routerInstance = new Router();
    routerInstance.routes.push({ path, method, controller, middlewares });
    return routerInstance;
  }

  /**
   * Get all registered routes
   * @returns A record of routes
   */
  public static list() {
    const records: Record<string, any> = {};
    const router = new Router();
    for (const { controller, path, method, middlewares } of router.routes) {
      // setting the object for path
      // eg.
      // {
      //   '/users': {}
      // }
      if (!records[path]) records[path] = {};
      // load middleware services on app startup
      const services = router.#getContainerServices(middlewares, controller);
      // assign the controller to the route path
      records[path][method] = async (req: Request) => {
        const mRes = await router.#handleMiddlewares(
          req,
          middlewares,
          services,
        );
        if (mRes) return responseParser(mRes);
        return router.#handleController(req, controller, services);
      };
    }
    return records;
  }

  #getContainerServices(middlewares: Middleware[], controller: Controller) {
    const services: Record<string, any> = {};
    for (const middleware of middlewares) {
      if (!isClass(middleware)) continue;
      const service = Container.get(middleware);
      services[middleware.name] = service;
    }
    // getting the class instance using dependency injection container
    if (isTuple(controller)) {
      const service = Container.get(controller[0]);
      services[controller[0].name] = service;
    }
    return services;
  }

  /**
   * Handle the controller
   * @param req - The request object
   * @param controller - The controller function
   * @param services - The services
   * @returns The response from the controller
   */
  async #handleController(
    req: Request,
    controller: Controller,
    services: Record<string, any>,
  ) {
    let res: any = undefined;
    if (isTuple(controller)) {
      // if controller is a tuple, get the class instance and call the method
      // else call the controller function
      // tuple controller eg. [UserController, 'index']
      // function controller eg. (req: Request) => any
      const service = services[controller[0].name];
      const funcName = controller[1];
      res = await service?.[funcName](req);
    } else {
      res = await controller(req);
    }
    return responseParser(res);
  }

  /**
   * Handle the middlewares
   * @param req - The request object
   * @param middlewares - The middlewares to handle
   * @param mServices - The middleware services
   * @returns The response from the middlewares
   */
  async #handleMiddlewares(
    req: Request,
    middlewares: Middleware[],
    services: Record<string, any>,
  ) {
    let mRes: any = undefined;
    for (const middleware of middlewares) {
      if (isClass(middleware)) {
        mRes = await services[middleware.name]?.handle(req);
      } else {
        mRes = await middleware(req);
      }
      // if middleware returns a response,
      // return it immediately to stop the execution of other middlewares
      if (mRes) return mRes;
    }
    return mRes;
  }
}
