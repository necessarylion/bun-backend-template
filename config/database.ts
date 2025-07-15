import { env, type SQLOptions } from 'bun';

export default {
  // Optional configuration
  hostname: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
  username: env.DB_USER,
  password: env.DB_PASSWORD,

  // Connection pool settings
  max: 20, // Maximum connections in pool
  idleTimeout: 30, // Close idle connections after 30s
  maxLifetime: 0, // Connection lifetime in seconds (0 = forever)
  connectionTimeout: 30, // Timeout when establishing new connections
} as SQLOptions;
