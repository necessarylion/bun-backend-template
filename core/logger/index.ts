import winston, { createLogger } from 'winston';
import loggerConfig from '#config/logger';
import { env } from 'bun';

declare module 'winston' {
  interface Logger {
    success: winston.LeveledLogMethod;
  }
}

export const logger = createLogger({
  ...loggerConfig,
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  level:
    env.NODE_ENV === 'development' ? 'silly' : (loggerConfig.level ?? 'info'),
});
