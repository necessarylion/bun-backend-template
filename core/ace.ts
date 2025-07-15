import { pascalCase, snakeCase } from 'change-case';
import { logger } from './logger';

export class Ace {
  async createMiddleware(name: string) {
    const className = pascalCase(name + 'Middleware');
    const middlewareContent = `import type { MiddlewareInterface } from "#core/types";
import { Service } from "typedi";

@Service()
export default class ${className} implements MiddlewareInterface {
  handle(req: Request): any {
    // your logic here
  }
}
    `;
    name = snakeCase(name);
    const file = `app/middlewares/${name}.middleware.ts`;
    if (await Bun.file(file).exists()) {
      logger.error(`Middleware already exists: > ${file}`);
      return;
    }
    await Bun.write(file, middlewareContent);
    logger.success(`Middleware created: > ${file}`);
  }
}
