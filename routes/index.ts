import Container from 'typedi';

// Handler type that accepts any class and a string
type HandlerTuple = [new (...args: any[]) => any, string];
type HandlerFunction = (req: Request) => any;
type Handler = HandlerTuple | HandlerFunction;

export class Route {

  // singleton
  private static instance: Route;
  public constructor() {
    if (Route.instance) {
      return Route.instance;
    }
    Route.instance = this;
    return Route.instance
  }

  private routes : {
    path: string;
    method: string;
    handler: Handler;
  }[] = [];

  /**
   * Register a GET route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static get(path: string, handler: Handler) {
    const route = new Route();
    route.routes.push({ path, method: 'GET' , handler});
  }

  /**
   * Register a POST route
   * @param path - The path of the route
   * @param handler - The handler function
   */
  public static post(path: string, handler: Handler) {
    const route = new Route();
    route.routes.push({ path, method: 'POST' , handler});
  }

  public static /**
  * Get all registered routes
  * @returns A record of routes
  */
  list() {
   const records: Record<string, any> = {}
   const routerInstance = new Route();
   for (const {handler, path, method} of routerInstance.routes) {
     if (!records[path]) records[path] = {}
     let classInstance: any;
     const isTuple = Array.isArray(handler)
     if (isTuple) {
       classInstance = Container.get(handler[0])
     }
     records[path][method] = async (req: Request) => {
       let res : any
       if (isTuple) {
         res = await classInstance[handler[1]](req)
       } else {
         res = await handler(req)
       }
       if (res instanceof Response) {
         return res
       }
       if (res instanceof Object) {
         return Response.json(res)
       }
       return new Response(res)
     }
   }
   return records;
 }
}