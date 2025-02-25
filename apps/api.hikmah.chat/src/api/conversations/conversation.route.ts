import { Router } from 'express';

import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import {
  CreateConversationValidator,
  GetConversationsByIdQueryValidator,
  GetConversationsQueryValidator,
  UpdateConversationValidator,
} from './conversation.validator';
import { Ollama } from '../../utils';
import { ChatService } from '../chat/chat.service';

class ConversationRoute {
  private readonly router: Router;
  private readonly ollama: Ollama;
  private readonly chatService: ChatService;
  private readonly conversationService: ConversationService;
  private readonly conversationController: ConversationController;

  constructor() {
    this.router = Router();
    this.ollama = Ollama.GetInstance();
    this.chatService = new ChatService(this.ollama);
    this.conversationService = new ConversationService(this.ollama);
    this.conversationController = new ConversationController(
      this.chatService,
      this.conversationService,
    );

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      GetConversationsQueryValidator.handle,
      this.conversationController.getAllConversations.bind(
        this.conversationController,
      ),
    );
    this.router.get(
      '/:id',
      GetConversationsByIdQueryValidator.handle,
      this.conversationController.getConversationById.bind(
        this.conversationController,
      ),
    );
    this.router.post(
      '/',
      CreateConversationValidator.handle,
      this.conversationController.createConversation.bind(
        this.conversationController,
      ),
    );
    this.router.patch(
      '/:id',
      UpdateConversationValidator.handle,
      this.conversationController.updateConversation.bind(
        this.conversationController,
      ),
    );
    this.router.delete(
      '/:id',
      GetConversationsByIdQueryValidator.handle,
      this.conversationController.deleteConversation.bind(
        this.conversationController,
      ),
    );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export { ConversationRoute };
