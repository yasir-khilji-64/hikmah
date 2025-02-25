import type { HealthCheckResponse, MessageResponse } from '@hikmah/contracts';
import { StatusCodes } from '@hikmah/contracts';
import type { Request, Response } from 'express';

import type { Database, Ollama } from '../../utils';

class IndexController {
  private database: Database;
  private ollama: Ollama;

  constructor(database: Database, ollama: Ollama) {
    this.database = database;
    this.ollama = ollama;
  }

  public index(_request: Request, response: Response<MessageResponse>): void {
    response.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Welcome to api.hikmah.chat',
    });
  }

  public async healthCheck(
    _request: Request,
    response: Response<HealthCheckResponse>,
  ): Promise<void> {
    const database = this.database.getConnectionStatus();
    const ollama = await this.ollama.getConnectionStatus();
    const isHealthy = database === 'connected' && ollama === 'running';
    const statusCode = isHealthy
      ? StatusCodes.OK
      : StatusCodes.SERVICE_UNAVAILABLE;
    const message = isHealthy ? 'OK' : 'Service Unavailable';

    response.status(statusCode).json({
      status: statusCode,
      message: message,
      database: database,
      ollama: ollama,
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  }
}

export { IndexController };
