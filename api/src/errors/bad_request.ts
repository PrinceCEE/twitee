import { HttpException } from "./http_exception";

export class BadRequestError extends HttpException {
  name = "BadRequestError";
  statusCode = 400;

  constructor(message?: string) {
    super();
    this.message = message ?? "Bad request";
  }
}
