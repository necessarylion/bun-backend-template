/**
 * Extends the built-in Bun Request class with additional utility methods
 * This extends the prototype of the existing Request class
 */

import vine, { errors } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';
import ValidationException from './exception/validation_exception';
import Exception from './exception/exception';

// Extend the Request prototype to add query method
if (!Request.prototype.query) {
  Request.prototype.query = function (): Record<string, string> {
    const url = new URL(this.url);
    const queryParams: Record<string, string> = {};
    // Parse all query parameters from the URL
    for (const [key, value] of url.searchParams.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  };
}

// Extend the Request prototype to add all method
if (!Request.prototype.all) {
  Request.prototype.all = async function (): Promise<Record<string, any>> {
    const queryParams = this.query();
    const body = await this.jsonBody();
    return { ...queryParams, ...body };
  };
}

// Extend the Request prototype to add jsonBody method
if (!Request.prototype.jsonBody) {
  Request.prototype.jsonBody = async function (): Promise<Record<string, any>> {
    let body: Record<string, any> = {};
    if (this.method === 'POST') {
      body = (await this.json()) as Record<string, any>;
    }
    return body;
  };
}

// Extend the Request prototype to add validate method
if (!Request.prototype.validate) {
  Request.prototype.validate = async function <Schema extends SchemaTypes>(
    schema: Schema,
  ): Promise<Record<string, any>> {
    try {
      return await vine.validate({
        schema,
        data: await this.all(),
      });
    } catch (error: any) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        throw new ValidationException(error.message, error.messages);
      } else {
        throw new Exception(error.message);
      }
    }
  };
}

// Type declaration to extend the Request interface
declare global {
  interface Request {
    query(): Record<string, string>;
    all(): Promise<Record<string, any>>;
    jsonBody(): Promise<Record<string, any>>;
    validate<Schema extends SchemaTypes>(
      schema: Schema,
    ): Promise<Record<string, any>>;
    params: Record<string, string>;
  }
}
