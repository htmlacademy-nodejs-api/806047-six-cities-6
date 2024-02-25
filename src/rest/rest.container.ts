import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/components.emun.js';
import { PinoLogger, Logger } from '../shared/lib/logger/index.js';
import { RestSchema, Config, RestConfig } from '../shared/lib/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/lib/database-client/index.js';
import { AppExceptionFilter, ExceptionFilter } from '../shared/lib/rest/index.js';

export function createRestApplicationContainer() {
  const restContainer = new Container();
  restContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return restContainer;
}

