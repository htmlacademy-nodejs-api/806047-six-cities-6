import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../lib/rest/index.js';
import { Logger } from '../../lib/logger/index.js';
import { Component } from '../../types/index.js';
import { Response } from 'express';
import { FindCommentsRequest, CreateCommentRequest } from './types/index.js';
import { RentService } from '../rent/index.js';
import { CommentService } from './comment.service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentService) protected readonly rentService: RentService,
    @inject(Component.CommentService) protected readonly commentService: CommentService
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController...');

    this.isExistingRent = this.isExistingRent.bind(this);

    this.addRoute({
      path: '/:rentId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('rentId')
      ]
    });
    this.addRoute({
      path: '/:rentId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('rentId'),
        new ValidateDtoMiddleware(CreateCommentDto),
      ]
    });
  }

  public async index(
    { params: { rentId } }: FindCommentsRequest,
    res: Response
  ) {
    if(!await this.isExistingRent(rentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with id ${rentId} does not exist`,
        'RentController',
      );
    }

    const comments = await this.commentService.findByRentId(rentId);
    this.ok(res, comments.map((comment) => fillDTO(CommentRdo, comment)));
  }

  public async create(
    { body }: CreateCommentRequest,
    res: Response,
  ) {
    if(!await this.isExistingRent(body.rentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent with id ${body.rentId} does not exist`,
        'RentController',
      );
    }

    const createdComment = await this.commentService.create(body);

    this.ok(res, fillDTO(CommentRdo, createdComment));
  }

  private async isExistingRent(rentId: string) {
    return await this.rentService.exists(rentId);
  }
}
