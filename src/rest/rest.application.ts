import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Logger } from '../shared/lib/logger/index.js';
import { RestSchema, Config } from '../shared/lib/config/index.js';
import { DatabaseClient } from '../shared/lib/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { ExceptionFilter } from '../shared/lib/rest/index.js';
import { UserController } from '../shared/modules /user/index.js';
import { RentController } from '../shared/modules /rent/index.js';
import { CommentController } from '../shared/modules /comment/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.RentController) private readonly rentController: RentController,
    @inject(Component.CommentController) private readonly commentController: CommentController
  ) {
    this.server = express();
  }

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

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initMiddleware() {
    this.server.use(express.json());

    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
  }

  private async initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/rents', this.rentController.router);
    this.server.use('/comments', this.commentController.router);
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database…');
    await this.initDatabase();
    this.logger.info('Init database completed');


    this.logger.info('Init app-level middleware');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server…');
    await this.initServer();

    this.logger.info('Init database completed');
  }
}
