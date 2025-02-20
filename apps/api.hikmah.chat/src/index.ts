import { app } from './app';
import { Config, Database, Logger } from './utils';

async function bootstrap(): Promise<void> {
  Logger.boot('DEBUG');
  try {
    const env = Config.CetInstance().env;
    const database = Database.GetInstance();
    const port = env.PORT;

    await database.connect();
    const server = app.listen(port, '0.0.0.0', (err?: Error) => {
      if (err) {
        throw err;
      }
      Logger.info(`Server: http://127.0.0.1:${port}`, bootstrap.name, {});
    });
    process.on('SIGINT', async () => {
      await database.disconnect();
      server.close((err?: Error) => {
        if (err) {
          throw err;
        }
        Logger.info('Server closed', bootstrap.name, {});
        process.exit(0);
      });
    });
  } catch (error) {
    Logger.error('Bootstrap failed with error', bootstrap.name, { error });
    process.exit(1);
  }
}

bootstrap().catch((error: Error) => {
  Logger.error('Unhandled error', bootstrap.name, { error });
  process.exit(1);
});
