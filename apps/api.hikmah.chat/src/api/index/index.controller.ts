import type { HealthCheckResponse, MessageResponse } from '@hikmah/contracts';
import { StatusCodes } from '@hikmah/contracts';
import type { Request, Response } from 'express';

import type { Database } from '../../utils';

class IndexController {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public index(_request: Request, response: Response<MessageResponse>): void {
    response.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Welcome to api.hikmah.chat',
    });
  }

  public healthCheck(
    _request: Request,
    response: Response<HealthCheckResponse>,
  ): void {
    const database = this.database.getConnectionStatus();
    const isHealthy = database === 'connected';
    const statusCode = isHealthy
      ? StatusCodes.OK
      : StatusCodes.SERVICE_UNAVAILABLE;
    const message = isHealthy ? 'OK' : 'Service Unavailable';

    response.status(statusCode).json({
      status: statusCode,
      message: message,
      database: database,
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  }
}

export { IndexController };
