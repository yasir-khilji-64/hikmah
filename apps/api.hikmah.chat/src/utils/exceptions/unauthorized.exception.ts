import { StatusCodes } from '@hikmah/contracts';

class UnauthorizedException extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.name = 'UnauthorizedException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedException);
    }
  }
}

export { UnauthorizedException };
