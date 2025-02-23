import type {
  ApiResponse,
  IConversation,
  PaginatedResponse,
} from '@hikmah/contracts';
import { StatusCodes } from '@hikmah/contracts';
import type { NextFunction, Request, Response } from 'express';

import type {
  CreateConversationDto,
  GetConversationByIdQueryDto,
  GetConversationsQueryDto,
  UpdateConversationDto,
} from './conversation.schema';
import type { ConversationService } from './conversation.service';

class ConversationController {
  private readonly conversationService: ConversationService;

  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  public async getAllConversations(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      unknown,
      GetConversationsQueryDto
    >,
    response: Response<ApiResponse<PaginatedResponse<IConversation>>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, pageSize, ...filters } = request.query;
      const result = await this.conversationService.listConversations(
        page,
        pageSize,
        filters,
      );
      response.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getConversationById(
    request: Request<
      GetConversationByIdQueryDto,
      Record<string, unknown>,
      unknown
    >,
    response: Response<ApiResponse<IConversation>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = request.params;
      const result = await this.conversationService.getConversationById(id);
      response.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createConversation(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateConversationDto
    >,
    response: Response<ApiResponse<IConversation>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.conversationService.createConversation(
        request.body,
      );
      response.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateConversation(
    request: Request<
      GetConversationByIdQueryDto,
      unknown,
      UpdateConversationDto
    >,
    response: Response<ApiResponse<IConversation>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const conversation = await this.conversationService.updateConversation(
        request.params.id,
        request.body,
      );
      response.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteConversation(
    request: Request<
      GetConversationByIdQueryDto,
      Record<string, unknown>,
      unknown
    >,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.conversationService.deleteConversation(request.params.id);
      response.status(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}

export { ConversationController };
