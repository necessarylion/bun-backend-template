import { snakeCase } from 'change-case';

export default class Exception extends Error {
  public readonly code: string;
  public status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.message = message;
    this.code = this.constructor.name;
    this.status = status;
  }

  handle() {
    return Response.json(
      {
        code: snakeCase(this.code).toUpperCase(),
        message: this.message,
        status: this.status,
      },
      { status: this.status },
    );
  }
}
