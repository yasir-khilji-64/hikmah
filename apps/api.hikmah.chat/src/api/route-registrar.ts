import type { Application } from 'express';

import { IndexRoute } from './index/index.route';

class RouteRegistrar {
  public static register(app: Application): void {
    app.use('/', new IndexRoute().getRoutes());
  }
}

export { RouteRegistrar };
