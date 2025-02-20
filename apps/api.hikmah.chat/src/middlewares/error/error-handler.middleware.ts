import type { ErrorResponse } from '@hikmah/contracts';
import { StatusCodes } from '@hikmah/contracts';
import type { NextFunction, Request, Response } from 'express';

import { Config } from '../../utils';

class ErrorHandlerMiddleware {
  private static readonly env = Config.CetInstance().env;

  public static handle(
    error: Error & {
      statusCode?: number;
      errors?: { path: string; message: string }[];
    },
    _request: Request,
    response: Response<ErrorResponse>,
    _next: NextFunction,
  ): void {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    response.status(statusCode).json({
      status: statusCode,
      message: error.message,
      errors: error.errors || undefined,
      stack:
        ErrorHandlerMiddleware.env.NODE_ENV === 'production'
          ? '🥞'
          : error.stack,
    });
  }
}

export { ErrorHandlerMiddleware };
