import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Logger } from '../shared/lib/logger/index.js';
import { RestSchema, Config } from '../shared/lib/config/index.js';
import { DatabaseClient } from '../shared/lib/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
// import { UserModel } from '../shared/modules /user/user.model.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient
  ) {}

  private async initDatabase() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.database.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');

    await this.initDatabase();

    // const user = await UserModel.create({
    //   email: 'test@email.local',
    //   avatar: 'keks.jpg',
    //   name: 'Keks2',
    //   userType: 'Pro',
    // });


    // console.log(user);

    this.logger.info('Init database completed');
  }
}
