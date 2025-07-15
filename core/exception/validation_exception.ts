import { snakeCase } from 'change-case';
import Exception from './exception';

export default class ValidationException extends Exception {
  public errors: Record<string, string>[] = [];

  constructor(message: string, errors: Record<string, string>[] = []) {
    super(message, 422);
    this.errors = errors;
  }

  override handle() {
    return Response.json(
      {
        code: snakeCase(this.code).toUpperCase(),
        message: this.message,
        status: 422,
        errors: this.errors,
      },
      { status: this.status },
    );
  }
}
