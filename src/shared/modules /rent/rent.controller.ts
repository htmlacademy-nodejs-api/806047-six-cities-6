/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../lib/rest/index.js';
import { Logger } from '../../lib/logger/index.js';
import { City, Component } from '../../types/index.js';
import { RentService } from './rent.service.interface.js';
import { Request, Response } from 'express';
import {
  FindAllRentsRequestType,
  CreateRentRequestType,
  FindByIdRentRequestType,
  UpdateRentRequestType,
  FindPremiumRentsByCityRequestType,
} from './types/index.js';
import { capitalize, fillDTO } from '../../helpers/common.js';
import { RentRdo } from './rdo/rent.rdo.js';
import { UserService } from '../user/index.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateCitydMiddleware } from './middleware/validate-city.middleware.js';
import { CreateRentDto } from './index.js';


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
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateRentDto)
      ]
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });

    this.addRoute({ path: '/:rentId',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentId')
      ]
    });
    this.addRoute({
      path: '/:rentId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentId')
      ]
    });
    this.addRoute({
      path: '/:rentId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentId')
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.findPremiumRentsByCity,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateCitydMiddleware('city')
      ]
    });

    this.addRoute({
      path: '/:rentId/favorite',
      method: HttpMethod.Patch,
      handler: this.addToFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentId'),
        new DocumentExistsMiddleware(this.rentService, 'Rent', 'rentId'),
      ]
    });

    this.addRoute({
      path: '/:rentId/favorite',
      method: HttpMethod.Delete,
      handler: this.deleteOfferFromFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentId'),
        new DocumentExistsMiddleware(this.rentService, 'Rent', 'rentId'),
      ]
    });
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
    const rents = await this.rentService.findPremiumRentsByCity(capitalize(city) as City);

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
        `Rent with id ${rentId} does not exist`, 'RentController',
      );
    }

    const rentById = await this.rentService.findById(rentId);

    this.ok(res, fillDTO(RentRdo, rentById));
  }

  public async getFavorites({ tokenPayload }: Request, res: Response) {
    const result = await this.rentService.findFavorite(tokenPayload.id);
    return this.ok(res, fillDTO(RentRdo, result));
  }

  public async addToFavorite(
    { tokenPayload, params }: Request,
    res: Response
  ) {
    const { rentId } = params;
    const user = await this.userService.findById(tokenPayload.id);
    if (!user?.favorites.includes(rentId)) {

      await this.userService.addRentToFavorites(tokenPayload.id, rentId);
    }

    const offer = await this.rentService.findById(rentId);

    this.ok(res, fillDTO(RentRdo, offer));
  }

  public async deleteOfferFromFavorite(
    { tokenPayload, params }: Request,
    res: Response
  ) {
    const { rentId } = params;
    const user = await this.userService.findById(tokenPayload.id);

    if (user?.favorites.includes(rentId)) {
      await this.userService.deleteRentFromFavorites(tokenPayload.id, rentId);
    }

    this.noContent(res, null);
  }
}
