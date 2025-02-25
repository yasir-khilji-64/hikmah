import type { DatabaseConnectionStatus } from './database.type';
import type { MessageResponse } from './message-response.type';
import type { OllamaConnectionStatus } from './ollama.type';

type HealthCheckResponse = MessageResponse & {
  database: DatabaseConnectionStatus;
  ollama: OllamaConnectionStatus;
  timestamp: Date;
  uptime: number;
};

export { HealthCheckResponse };
