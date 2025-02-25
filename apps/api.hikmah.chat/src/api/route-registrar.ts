import type { Application } from 'express';

import { ChatRoute } from './chat/chat.route';
import { ConversationRoute } from './conversations/conversation.route';
import { IndexRoute } from './index/index.route';

class RouteRegistrar {
  public static register(app: Application): void {
    app.use('/', new IndexRoute().getRoutes());
    app.use('/api/v1/conversations', new ConversationRoute().getRoutes());
    app.use('/api/v1/chats', new ChatRoute().getRouter());
  }
}

export { RouteRegistrar };
