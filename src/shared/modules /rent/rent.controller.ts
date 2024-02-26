/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../lib/rest/index.js';
import { Logger } from '../../lib/logger/index.js';
import { City, Component } from '../../types/index.js';
import { RentService } from './rent.service.interface.js';
import { Response } from 'express';
import {
  FindAllRentsRequestType,
  CreateRentRequestType,
  FindByIdRentRequestType,
  UpdateRentRequestType,
  FindPremiumRentsByCityRequestType,
} from './types/index.js';
import { fillDTO } from '../../helpers/common.js';
import { RentRdo } from './rdo/rent.rdo.js';
import { UserService } from '../user/index.js';
import { StatusCodes } from 'http-status-codes';

function isCity(city: string): boolean {
  return Object.values(City).includes(city as City);
}


@injectable()
export class RentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentService) protected readonly rentService: RentService,
    @inject(Component.UserService) protected readonly userService: UserService
  ) {
    super(logger);
    this.logger.info('Register routes for RentController...');


    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:rentId', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:rentId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:rentId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.findPremiumRentsByCity });
  }

  public async index(
    { body: { amount } }: FindAllRentsRequestType,
    res: Response
  ) {
    const rents = await this.rentService.find(amount);
    this.ok(res, rents.map((rent) => fillDTO(RentRdo, rent)));
  }

  public async create(
    { body }: CreateRentRequestType,
    res: Response
  ) {

    const isExistingUser = await this.userService.exists(body.userId);

    if(!isExistingUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${body.userId} does not exist`,
        'RentController',
      );
    }

    const created = await this.rentService.create(body);

    this.ok(res, fillDTO(RentRdo, created));
  }

  public async update(
    { body, params: { rentId } }: UpdateRentRequestType & FindByIdRentRequestType,
    res: Response,
  ) {
    const isRentExisted = await this.rentService.exists(rentId);

    if(!isRentExisted) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with id ${body.userId} does not exist`,
        'RentController',
      );
    }

    const updated = await this.rentService.updateById(
      rentId,
      body,
    );

    this.ok(res, fillDTO(RentRdo, updated));
  }

  public async delete(
    { params: { rentId }}: FindByIdRentRequestType,
    res: Response
  ) {
    const deleted = await this.rentService.deleteRentById(rentId);

    if(!deleted) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with id ${rentId} does not exist`,
        'RentController',
      );
    }

    this.ok(res, deleted.id);
  }

  async findPremiumRentsByCity(
    { params: { city } }: FindPremiumRentsByCityRequestType,
    res: Response
  ) {
    if(!city || !isCity(city)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with city ${city} does not exist`,
        'RentController',
      );
    }

    const rents = await this.rentService.findPremiumRentsByCity(city as City);

    this.ok(res, rents.map((rent) => fillDTO(RentRdo, rent)));
  }


  public async findById(
    { params: { rentId } }: FindByIdRentRequestType,
    res: Response
  ) {
    const isExstingRent = await this.rentService.exists(rentId);

    if(!isExstingRent) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with id ${rentId} does not exist`,
        'RentController',
      );
    }

    const rentById = await this.rentService.findById(rentId);

    this.ok(res, fillDTO(RentRdo, rentById));
  }
}
