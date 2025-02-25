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
import type { ChatService } from '../chat/chat.service';

class ConversationController {
  private readonly chatService: ChatService;
  private readonly conversationService: ConversationService;

  constructor(
    chatService: ChatService,
    conversationService: ConversationService,
  ) {
    this.chatService = chatService;
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
      const { message, model_name } = request.body;
      const conversation =
        await this.conversationService.createConversation(model_name);
      response.status(StatusCodes.CREATED);
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Transfer-Encoding', 'chunked');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');
      response.flushHeaders();
      response.write(
        `data: ${JSON.stringify({ conversationId: conversation.id })}\n\n`,
      );
      await this.chatService.createChat(
        { role: 'user', content: message },
        conversation.id,
        (chunk) => {
          response.write(chunk.content);
        },
        async (savedMessage) => {
          await Promise.all([
            this.conversationService.createTitle(
              conversation.id,
              message,
              savedMessage.content,
            ),
            this.conversationService.createTags(
              conversation.id,
              message,
              savedMessage.content,
            ),
          ]);
          response.end();
        },
        model_name,
      );
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
