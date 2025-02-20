import type { Application } from 'express';

import { ErrorHandlerMiddleware, NotFoundMiddleware } from './error';

class MiddlewareRegistrar {
  public static register(app: Application): void {
    app.use(NotFoundMiddleware.handle);
    app.use(ErrorHandlerMiddleware.handle);
  }
}

export { MiddlewareRegistrar };
