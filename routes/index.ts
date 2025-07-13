import Container from 'typedi';

// Handler type that accepts any class and a string
type HandlerTuple = [new (...args: any[]) => any, string];

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
    handler: HandlerTuple;
  }[] = [];

  public static get(path: string, handler: HandlerTuple) {
    const route = new Route();
    route.routes.push({ path, method: 'GET' , handler});
  }

  public static post(path: string, handler: HandlerTuple) {
    const route = new Route();
    route.routes.push({ path, method: 'POST' , handler});
  }

  public static getRoutes() {
    const instance = new Route();
    const routes: Record<string, any> = {}
    for (const route of instance.routes) {
      const instance = Container.get(route.handler[0])
      if (!routes[route.path]) {
        routes[route.path] = {}
      } 
      routes[route.path][route.method] = async (req: Request) => {
        const res = await instance[route.handler[1]](req)
        if (res instanceof Response) {
          return res
        }
        if (res instanceof Object) {
          return Response.json(res)
        }
        return new Response(res)
      }
    }
    return routes;
  }
}