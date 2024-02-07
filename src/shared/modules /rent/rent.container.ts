import { Container } from 'inversify';
import { Component } from '../../types/components.emun.js';
import { DefaultRentService } from './default-rent.service.js';
import { types } from '@typegoose/typegoose';
import { RentService } from './rent.service.interface.js';
import { RentEntity, RentModel } from './rent.entity.js';

export function createRentContainer() {
  const container = new Container();

  container.bind<RentService>(Component.RentService).to(DefaultRentService).inSingletonScope();
  container.bind<types.ModelType<RentEntity>>(Component.RentModel).toConstantValue(RentModel);

  return container;
}


