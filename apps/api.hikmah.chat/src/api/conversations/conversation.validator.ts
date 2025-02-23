import type { NextFunction, Request, Response } from 'express';

import type {
  CreateConversationDto,
  GetConversationByIdQueryDto,
  GetConversationsQueryDto,
  UpdateConversationDto,
} from './conversation.schema';
import {
  createConversationSchema,
  getConversationByIdQuerySchema,
  getConversationsQuerySchema,
  updateConversationSchema,
} from './conversation.schema';
import { UnprocessableEntityException } from '../../utils';

class GetConversationsQueryValidator {
  public static handle(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      unknown,
      GetConversationsQueryDto
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const result = getConversationsQuerySchema.safeParse(request.query);
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

class GetConversationsByIdQueryValidator {
  public static handle(
    request: Request<
      GetConversationByIdQueryDto,
      Record<string, unknown>,
      unknown
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const result = getConversationByIdQuerySchema.safeParse(request.params);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    request.params = result.data;
    next();
  }
}

class CreateConversationValidator {
  public static handle(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateConversationDto
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const result = createConversationSchema.safeParse(request.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    request.body = result.data;
    next();
  }
}

class UpdateConversationValidator {
  public static handle(
    request: Request<
      GetConversationByIdQueryDto,
      unknown,
      UpdateConversationDto
    >,
    _response: Response,
    next: NextFunction,
  ): void {
    const params = getConversationByIdQuerySchema.safeParse(request.params);
    if (!params.success) {
      const errors = params.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    request.params = params.data;

    const body = updateConversationSchema.safeParse(request.body);
    if (!body.success) {
      const errors = body.error.issues.map((issue) => {
        return {
          path: issue.path.join('.'),
          message: issue.message,
        };
      });
      return next(new UnprocessableEntityException(errors));
    }
    request.body = body.data;

    next();
  }
}

export {
  GetConversationsQueryValidator,
  GetConversationsByIdQueryValidator,
  CreateConversationValidator,
  UpdateConversationValidator,
};
