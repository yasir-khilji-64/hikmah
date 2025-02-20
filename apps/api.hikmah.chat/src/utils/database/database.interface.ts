import type { DatabaseConnectionStatus } from '@hikmah/contracts';

interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnectionStatus(): DatabaseConnectionStatus;
}

export { IDatabase };
