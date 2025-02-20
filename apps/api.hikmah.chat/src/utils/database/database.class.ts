import type { DatabaseConnectionStatus } from '@hikmah/contracts';
import mongoose from 'mongoose';

import { Config } from '../config';
import type { IDatabase } from './database.interface';
import { Logger } from '../logger';

class Database implements IDatabase {
  private static instance: Database;
  private static env = Config.CetInstance().env;
  private mongoURI: string;

  private constructor() {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_DATABASE,
    } = Database.env;
    this.mongoURI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?retryWrites=true&w=majority&authSource=admin`;
  }

  public static GetInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    mongoose.connection.on('connected', () => {
      Logger.info('MongoDB Connected', Database.name, {});
    });
    mongoose.connection.on('disconnected', () => {
      Logger.debug('MongoDB Disconnected', Database.name, {});
    });
    mongoose.connection.on('reconnected', () => {
      Logger.debug('MongoDB Reconnected', Database.name, {});
    });
    mongoose.connection.on('error', (error) => {
      Logger.error('MongoDB Connect Error', Database.name, { error });
    });
    mongoose.connection.on('close', () => {
      Logger.debug('MongoDB Connection Closed', Database.name, {});
    });
    try {
      await mongoose.connect(this.mongoURI);
    } catch (error) {
      Logger.error('MongoDB Connection Failed', Database.name, { error });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      Logger.error('MongoDB Disconnect Error', Database.name, { error });
      throw error;
    }
  }

  public getConnectionStatus(): DatabaseConnectionStatus {
    const connectionStatus = mongoose.connection.readyState;
    switch (connectionStatus) {
      case 0:
        return 'disconnected';
      case 1:
        return 'connected';
      case 2:
        return 'connecting';
      case 3:
        return 'disconnecting';
      default:
        return 'uninitialized';
    }
  }
}

export { Database };
