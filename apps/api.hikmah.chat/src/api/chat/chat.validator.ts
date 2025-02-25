import type { NextFunction, Request, Response } from 'express';

import type { CreateChatDto, GetChatsQueryDto } from './chat.schema';
import { createChatSchema, getChatsQuerySchema } from './chat.schema';
import { UnprocessableEntityException } from '../../utils';

class GetChatsQueryValidator {
  public static handle(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      unknown,
      GetChatsQueryDto
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const result = getChatsQuerySchema.safeParse(request.query);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    request.query = result.data;
    next();
  }
}

class CreateChatValidator {
  public static handle(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateChatDto
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const result = createChatSchema.safeParse(request.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    next();
  }
}

export { GetChatsQueryValidator, CreateChatValidator };
