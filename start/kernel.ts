import { Router } from "#core/router";
import { logger } from "#utils/logger.utils";
import { env, serve } from "bun";
import { Migration } from '#utils/migration.utils'

// run migration before server start
const migration = new Migration()
await migration.up()

serve({
  port: env.PORT,
  routes: Router.list(),
  fetch: async () => new Response('Route not found', { status: 404 })
})

logger.info(`Server is running on http://localhost:${env.PORT}`)