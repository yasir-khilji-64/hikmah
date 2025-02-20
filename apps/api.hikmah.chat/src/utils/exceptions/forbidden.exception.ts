import { StatusCodes } from '@hikmah/contracts';

class ForbiddenException extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.name = 'ForbiddenException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenException);
    }
  }
}

export { ForbiddenException };
