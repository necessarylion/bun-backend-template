import { env, serve } from 'bun';
import { Router } from '#core/router';
import { logger } from '#core/logger';
import { Migration } from '#core/migration';

// run migration before server start
if (env.NODE_ENV === 'production') {
  const migration = new Migration();
  await migration.up();
}

serve({
  port: env.PORT,
  routes: Router.list(),
  fetch: async () => new Response('Route not found', { status: 404 }),
});

logger.info(`Server is running on http://localhost:${env.PORT}`);
