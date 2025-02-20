import { StatusCodes } from '@hikmah/contracts';

class UnprocessableEntityException extends Error {
  public readonly statusCode: number;
  public errors: { path: string; message: string }[];

  constructor(errors: { path: string; message: string }[]) {
    super('Unprocessable Entity');
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    this.errors = errors;
    this.name = 'UnprocessableEntityException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnprocessableEntityException);
    }
  }
}

export { UnprocessableEntityException };
