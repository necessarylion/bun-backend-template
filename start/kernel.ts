import { Route } from "../router/index";
import { logger } from "#utils/logger.utils";
import { env, serve } from "bun";

serve({
  port: env.PORT,
  routes: Route.list(),
  fetch: async () => new Response('Route not found', { status: 404 })
})

logger.info(`Server is running on http://localhost:${env.PORT}`)