import { Router } from ".";
import type { Controller, Middleware, RouteItem } from "./types";

export default class Route {

  /**
   * The instance of the Route class
   * @type {Route}
   */
  private static instance: Route;

  /**
   * The middlewares array
   * @type {Array}
   */
  private middlewares: Middleware[] = []

  /**
   * The current path
   * @type {string}
   */
   private currentPath: string = ''

  /**
   * Constructor for the Route class
   * @returns The instance of the Route class
   */
  public constructor() {
    if (!Route.instance) Route.instance = this;
    return Route.instance
  }

  /**
   * Group routes
   * @param path - The path of the route
   * @param cb - The callback function
   * @returns The instance of the Route class
   */
  public static group(path: string, cb: () => void) {
    const route = new Route()
    route.middlewares = []
    route.currentPath = path
    cb()
    return route
  }

  /**
   * Add a middleware to the route
   * @param middleware - The middleware function
   * @returns The instance of the Route class
   */
  public middleware(middleware: Middleware) {
    this.middlewares.push(middleware)
    return this
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
   * Add a route
   * @param path - The path of the route
   * @param method - The method of the route
   * @param controller - The controller function
   * @returns The instance of the Route class
   */
  public static add(path: string, method: string, controller: Controller) {
    const route = new Route()
    let newPath = (route.currentPath + '/' + path).replace(/\/+/g, '/').trim().replace(/\/$/, '')
    newPath = newPath === '' ? '/' : newPath
    return Router.add(newPath, method, controller, route.middlewares);
  }
}