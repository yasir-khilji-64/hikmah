import type { DatabaseConnectionStatus } from './database.type';
import type { MessageResponse } from './message-response.type';

type HealthCheckResponse = MessageResponse & {
  database: DatabaseConnectionStatus;
  timestamp: Date;
  uptime: number;
};

export { HealthCheckResponse };
