import { StatusCodes } from '@hikmah/contracts';

class NotFoundException extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Not Found') {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = 'NotFoundException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }
}

export { NotFoundException };
