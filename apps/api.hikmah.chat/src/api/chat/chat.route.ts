import { Router } from 'express';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatValidator, GetChatsQueryValidator } from './chat.validator';
import { Ollama } from '../../utils';

class ChatRoute {
  private router: Router;
  private ollama: Ollama;
  private chatService: ChatService;
  private chatController: ChatController;

  constructor() {
    this.router = Router();
    this.ollama = Ollama.GetInstance();
    this.chatService = new ChatService(this.ollama);
    this.chatController = new ChatController(this.chatService);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      GetChatsQueryValidator.handle,
      this.chatController.getAllChats.bind(this.chatController),
    );
    this.router.post(
      '/',
      CreateChatValidator.handle,
      this.chatController.createChat.bind(this.chatController),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export { ChatRoute };
