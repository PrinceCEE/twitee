import { HttpException } from "./http_exception";

export class UnauthorizedError extends HttpException {
  name = "UnauthorizedError";
  statusCode = 401;

  constructor(message?: string) {
    super();
    this.message = message ?? "Unauthorized";
  }
}
