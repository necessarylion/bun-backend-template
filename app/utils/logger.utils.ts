import { format, createLogger, transports } from 'winston';
const { combine, timestamp, colorize, printf, json } = format;

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Custom format for development (human-readable)
const devFormat = combine(
  colorize({ all: true, colors: {
    info: 'blue',
    error: 'red',
    warn: 'yellow',
    debug: 'green',
    verbose: 'cyan',
  } }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[BUN] ${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Custom format for production (JSON for log aggregation)
const prodFormat = combine(
  timestamp(),
  json()
);

export const logger = createLogger({
  level: 'info',
  format: isProduction ? prodFormat : devFormat,
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});