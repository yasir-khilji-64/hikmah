import type { Application } from 'express';

import { ConversationRoute } from './conversations/conversation.route';
import { IndexRoute } from './index/index.route';

class RouteRegistrar {
  public static register(app: Application): void {
    app.use('/', new IndexRoute().getRoutes());
    app.use('/api/v1/conversations', new ConversationRoute().getRoutes());
  }
}

export { RouteRegistrar };
