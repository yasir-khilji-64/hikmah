type DatabaseConnectionStatus =
  | 'disconnected'
  | 'connected'
  | 'connecting'
  | 'disconnecting'
  | 'uninitialized';

export { DatabaseConnectionStatus };
