import { env, serve } from 'bun';
import { Router } from '#core/router';
import { logger } from '#core/logger';
import { Migration } from '#core/migration';

// run migration before server start
if (env.NODE_ENV === 'production') {
  try {
    const migration = new Migration();
    await migration.up();
  } catch (error) {
    logger.error('Migration failed:', error);
  }
}

serve({
  port: env.PORT,
  routes: Router.list(),
  fetch: async () => new Response('Route not found', { status: 404 }),
});

logger.info(`[${env.NODE_ENV}] Server is running on http://localhost:${env.PORT}`);
