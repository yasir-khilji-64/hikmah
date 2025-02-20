import { StatusCodes } from '@hikmah/contracts';

class ConflictException extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Conflict') {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = 'ConflictException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictException);
    }
  }
}

export { ConflictException };
