export abstract class HttpException implements Error {
  message: string;
  name: string;
  statusCode: number;
}
