import type {
  IChatMessage,
  IConversation,
  PaginatedResponse,
} from '@hikmah/contracts';
import { Types, type FilterQuery } from 'mongoose';

import { ConversationModel } from './conversation.model';
import type {
  GetConversationsQueryDto,
  UpdateConversationDto,
} from './conversation.schema';
import type { Ollama } from '../../utils';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '../../utils';

class ConversationService {
  private ollama: Ollama;
  constructor(ollama: Ollama) {
    this.ollama = ollama;
  }

  public async listConversations(
    page: number = 1,
    pageSize: number = 10,
    filters: Partial<GetConversationsQueryDto>,
  ): Promise<PaginatedResponse<IConversation>> {
    const skip = (page - 1) * pageSize;
    const query: FilterQuery<IConversation> = {};
    if (filters.showDeleted) {
      query.is_deleted = true;
    }
    if (filters.modelName) {
      query.model_name = filters.modelName;
    }
    if (filters.startDate || filters.endDate) {
      query.last_message_at = {};
      if (filters.startDate) {
        query.last_message_at.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.last_message_at.$lte = new Date(filters.endDate);
      }
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { tags: { $regex: filters.search, $options: 'i' } },
      ];
    }
    const sortOrder = filters.sort === 'asc' ? 1 : -1;

    try {
      const [conversations, totalConversations] = await Promise.all([
        await ConversationModel.find(query, {
          _id: 0,
          id: '$_id',
          title: '$title',
          model_name: '$model_name',
          tag: '$tags',
          status: '$status',
          last_message_at: '$last_message_at',
        })
          .sort({ last_message_at: sortOrder })
          .skip(skip)
          .limit(pageSize)
          .lean(),
        await ConversationModel.countDocuments(query),
      ]);
      const totalPages = Math.ceil(totalConversations / pageSize);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return {
        data: conversations,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalItems: totalConversations,
          hasNext: hasNext,
          hasPrevious: hasPrevious,
        },
      };
    } catch (error) {
      Logger.error('Error fetching conversations', ConversationService.name, {
        error,
      });
      throw new InternalServerErrorException('Failed to fetch conversations');
    }
  }

  public async getConversationById(
    id: string,
  ): Promise<IConversation & { messages: IChatMessage[] }> {
    try {
      const conversation = await ConversationModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'chat_messages',
            localField: '_id',
            foreignField: 'conversation_id',
            as: 'messages',
          },
        },
      ]).exec();
      if (conversation.length === 0) {
        throw new NotFoundException('Conversation not found');
      }
      return conversation[0];
    } catch (error) {
      Logger.error('Error fetching conversation', ConversationService.name, {
        error,
      });
      throw error;
    }
  }

  public async createConversation(modelName: string): Promise<IConversation> {
    try {
      const conversation = await ConversationModel.create({
        title: 'Untitled Conversation',
        model_name: modelName,
        tags: [],
        is_deleted: false,
        last_message_at: new Date(),
        metadata: {},
      });
      return conversation;
    } catch (error) {
      Logger.error('Error creating conversation', ConversationService.name, {
        error,
      });
      throw new InternalServerErrorException('Error creating conversation');
    }
  }

  public async updateConversation(
    id: string,
    payload: UpdateConversationDto,
  ): Promise<IConversation> {
    try {
      const updatedConversation = await ConversationModel.findByIdAndUpdate(
        { _id: id, is_deleted: { $ne: true } },
        { $set: payload },
        {
          returnDocument: 'after',
          projection: {
            updated_at: 0,
            _id: 1,
            title: 1,
            tags: 1,
            model_name: 1,
            status: 1,
            last_message_at: 1,
            metadata: 1,
            is_deleted: {
              $cond: {
                if: '$is_deleted',
                then: '$is_deleted',
                else: '$$REMOVE',
              },
            },
            deleted_at: {
              $cond: {
                if: '$is_deleted',
                then: '$deleted_at',
                else: '$$REMOVE',
              },
            },
          },
        },
      );
      if (!updatedConversation) {
        throw new NotFoundException('Conversation not found');
      }
      return updatedConversation;
    } catch (error) {
      Logger.error('Error updating conversation', ConversationService.name, {
        error,
      });
      throw error;
    }
  }

  public async deleteConversation(id: string): Promise<void> {
    try {
      const updatedConversation = await ConversationModel.findByIdAndUpdate(
        { _id: id, is_deleted: { $ne: true } },
        {
          $set: {
            is_deleted: true,
            deleted_at: new Date(),
          },
        },
      );
      if (!updatedConversation) {
        throw new NotFoundException('Conversation not found');
      }
      return;
    } catch (error) {
      Logger.error('Error deleting conversation', ConversationService.name, {
        error,
      });
      throw error;
    }
  }

  public async createTitle(
    conversationId: string,
    message: string,
    assistant_message: string,
  ): Promise<void> {
    try {
      const titleResponse = await this.ollama.sendMessage(
        { role: 'user', content: message },
        {
          model: 'llama3.1:8b',
          messages: [
            {
              role: 'assistant',
              content: assistant_message,
            },
          ],
          options: {
            temperature: 0.5,
          },
        },
        ['TITLE_GENERATION'],
      );
      await ConversationModel.findByIdAndUpdate(
        new Types.ObjectId(conversationId),
        {
          $set: {
            title: titleResponse.message.content,
          },
        },
      );
      return;
    } catch (error) {
      Logger.error('Error generating title', ConversationService.name, {
        error,
      });
      throw new Error('Failed to generate title');
    }
  }

  public async createTags(
    conversationId: string,
    message: string,
    assistant_message: string,
  ): Promise<void> {
    try {
      const tagResponse = await this.ollama.sendMessage(
        { role: 'user', content: message },
        {
          model: 'llama3.1:8b',
          messages: [
            {
              role: 'assistant',
              content: assistant_message,
            },
          ],
          options: {
            temperature: 0.5,
          },
        },
        ['TAG_GENERATION'],
      );
      await ConversationModel.findByIdAndUpdate(
        new Types.ObjectId(conversationId),
        {
          $set: {
            tags: tagResponse.message.content,
          },
        },
      );
      return;
    } catch (error) {
      Logger.error('Error generating tags', ConversationService.name, {
        error,
      });
      throw new Error('Failed to generate tags');
    }
  }
}

export { ConversationService };
