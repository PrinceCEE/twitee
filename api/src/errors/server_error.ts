import { HttpException } from "./http_exception";

export class InternalServerError extends HttpException {
  name = "InternalServerError";
  statusCode = 500;

  constructor(message?: string) {
    super();
    this.message = message ?? "Internal server error";
  }
}
