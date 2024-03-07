import * as Mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/components.emun.js';
import { Logger } from '../logger/index.js';
import { setTimeout } from 'node:timers/promises';


enum MongoConnectEnum {
  RetryCount = 5,
  RetryTimeout = 1000
}


@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    this.logger.info(`MondoDB connected uri ${uri}`);

    if(this.isConnectedToDatabase()) {
      throw Error('MongoDB client already connected.');
    }

    let attempt = 0;

    this.logger.info('Trying to connect to MongoDB…');

    while(attempt < MongoConnectEnum.RetryCount) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;

        this.logger.info('Database connection established.');
        return;
      } catch(error) {
        attempt++;

        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);

        await setTimeout(MongoConnectEnum.RetryTimeout);
      }
    }

    throw new Error(`Unable to establish database connection after ${MongoConnectEnum.RetryTimeout}.`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
