import { snakeCase } from 'change-case';
import Exception from './exception';

export default class ServerException extends Exception {
  constructor(message: string, status: number = 500) {
    super(message, status);
  }

  override handle() {
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
