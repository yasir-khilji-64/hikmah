import type {
  ChatMessage,
  ChatRequest,
  FinalStreamResponse,
  IChatMessage,
  OllamaMessage,
  PaginatedResponse,
} from '@hikmah/contracts';
import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

import { ChatMessageModel } from './chat.model';
import type { GetChatsQueryDto } from './chat.schema';
import type { Ollama } from '../../utils';
import { InternalServerErrorException, Logger } from '../../utils';

class ChatService {
  private ollama: Ollama;

  constructor(ollama: Ollama) {
    this.ollama = ollama;
  }

  public async getAllChats(
    page: number = 1,
    pageSize: number = 10,
    conversationId: string,
    filters: Partial<GetChatsQueryDto>,
  ): Promise<PaginatedResponse<IChatMessage>> {
    try {
      const skip = (page - 1) * pageSize;
      const query: FilterQuery<IChatMessage> = {
        conversation_id: new Types.ObjectId(conversationId),
      };
      if (filters?.role) {
        query.role = filters.role;
      }
      if (filters?.startDate || filters?.endDate) {
        query.timestamp = {};
        if (filters.startDate) {
          query.timestamp.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.timestamp.$lte = new Date(filters.endDate);
        }
      }
      if (filters?.search) {
        query.content = { $regex: filters.search, $options: 'i' };
      }
      const sortOrder = filters?.sort === 'desc' ? -1 : 1;

      const [chats, totalChats] = await Promise.all([
        await ChatMessageModel.find(query)
          .sort({ timestamp: sortOrder })
          .skip(skip)
          .limit(pageSize)
          .lean(),
        await ChatMessageModel.countDocuments(query),
      ]);
      const totalPages = Math.ceil(totalChats / pageSize);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return {
        data: chats,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalItems: totalChats,
          hasNext: hasNext,
          hasPrevious: hasPrevious,
        },
      };
    } catch (err) {
      const error = err as Error;
      Logger.error('Error fetching chats', ChatService.name, { error });
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createChat(
    message: OllamaMessage,
    conversation_id: string,
    onChunk: (chunk: ChatMessage) => void,
    onComplete: (savedMessage: IChatMessage) => void,
    model?: string,
  ): Promise<void> {
    try {
      const messages = await ChatMessageModel.find(
        { conversation_id: new Types.ObjectId(conversation_id) },
        { role: 1, content: 1, 'metadata.model': 1 },
      ).sort({ timestamp: 1 });
      const selectedModel =
        model ??
        (messages.length > 0
          ? messages[messages.length - 1].metadata?.model
          : 'llama3.1:8b');
      await ChatMessageModel.create({
        conversation_id: new Types.ObjectId(conversation_id),
        role: message.role,
        content: message.content.trim(),
        timestamp: new Date(),
        metadata: {
          model: selectedModel ?? 'llama3.1:8b',
        },
      });
      const history: ChatRequest = {
        model: selectedModel as string,
        messages: messages.map((message) => {
          return {
            role: message.role,
            content: message.content,
          };
        }),
        stream: true,
        options: {
          temperature: 0.9,
        },
      };
      await this.ollama.streamMessages(
        message,
        onChunk,
        history,
        ['GENERAL', 'CONTEXT_AWARENESS', 'TYPO_CORRECTION'],
        async (metadata: FinalStreamResponse) => {
          try {
            const savedMessage = await ChatMessageModel.create({
              conversation_id: new Types.ObjectId(conversation_id),
              role: 'assistant',
              content: metadata.full_message.replace(/\n/g, '\n'),
              timestamp: metadata.created_at,
              metadata: {
                model: metadata.model,
                done: metadata.done,
                done_reason: metadata.done_reason,
                total_duration: metadata.total_duration,
                eval_count: metadata.eval_count,
                eval_duration: metadata.eval_duration,
              },
            });
            onComplete(savedMessage);
          } catch (error) {
            Logger.error('Error saving chat message', ChatService.name, {
              error,
            });
            throw error;
          }
        },
      );
    } catch (error) {
      Logger.error('Error creating Ollama response', ChatService.name, {
        error,
      });
      throw error;
    }
  }
}

export { ChatService };
