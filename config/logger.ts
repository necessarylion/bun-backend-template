import { jsonPrint, prettyPrint } from '#core/logger/formatter';
import { env } from 'bun';
import { transports, type LoggerOptions } from 'winston';

export default {
  level: 'info',
  format: env.NODE_ENV === 'production' ? jsonPrint() : prettyPrint(),
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
} as LoggerOptions;
