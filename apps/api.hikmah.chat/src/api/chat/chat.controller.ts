import {
  type ChatMessage,
  type ApiResponse,
  type IChatMessage,
  type PaginatedResponse,
  StatusCodes,
} from '@hikmah/contracts';
import type { NextFunction, Request, Response } from 'express';

import type { CreateChatDto, GetChatsQueryDto } from './chat.schema';
import type { ChatService } from './chat.service';
import { BadRequestException, Logger } from '../../utils';

class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  public async getAllChats(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      unknown,
      GetChatsQueryDto
    >,
    response: Response<ApiResponse<PaginatedResponse<IChatMessage>>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { conversation_id, page, pageSize, ...filters } = request.query;
      const result = await this.chatService.getAllChats(
        page,
        pageSize,
        conversation_id,
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

  public async createChat(
    request: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateChatDto
    >,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { conversation_id, message, model } = request.body;
      response.status(StatusCodes.CREATED);
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Transfer-Encoding', 'chunked');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');
      response.flushHeaders();

      await this.chatService.createChat(
        {
          role: 'user',
          content: message,
        },
        conversation_id,
        (chunk: ChatMessage) => {
          response.write(chunk.content);
        },
        async (savedMessage) => {
          Logger.info('Chat Message Created', ChatController.name, {
            savedMessage,
          });
          response.end();
        },
        model,
      );
    } catch (error) {
      Logger.error('Chat Streaming Error', ChatController.name, { error });
      next(new BadRequestException((error as Error).message));
    }
  }
}

export { ChatController };
