import { format } from 'winston';
const { combine, timestamp, colorize, printf, json } = format;

export function prettyPrint() {
  return combine(
    colorize({
      all: true,
      colors: {
        info: 'blue',
        error: 'red',
        warn: 'yellow',
        success: 'green',
        http: 'magenta',
        debug: 'green',
        verbose: 'cyan',
      },
    }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp, ...meta }) => {
      const metaString =
        Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
      return `[BUN] ${timestamp} [${level}]: ${message} ${metaString}`;
    }),
  );
}

export function jsonPrint() {
  return combine(timestamp(), json());
}
