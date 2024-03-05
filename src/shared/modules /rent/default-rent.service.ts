import { inject, injectable } from 'inversify';
import { RentService } from './rent.service.interface.js';
import { Component } from '../../types/components.emun.js';
import { Logger } from '../../lib/logger/index.js';
import { CreateRentDto } from './index.js';
import { RentEntity } from './rent.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UpdateRentDto } from './dto/update-rent.dto.js';
import { DEFAULT_RENTS_COUNT } from './rent.const.js';
import { SortType } from '../../types/index.js';
import { City } from '../../types/city.enum.js';

@injectable()
export class DefaultRentService implements RentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentModel) private readonly rentModel: types.ModelType<RentEntity>
  ) {}


  async create(dto: CreateRentDto): Promise<DocumentType<RentEntity>> {
    const result = await this.rentModel.create(dto);

    this.logger.info(`New rent created: ${dto.title}`);
    return result;
  }

  async find(count = DEFAULT_RENTS_COUNT): Promise<DocumentType<RentEntity>[]> {
    return await this.rentModel
      .find()
      .limit(count)
      .exec();
  }

  async updateCommentsCountAndRaiting(rendId: string, rating: number) {
    return await this.rentModel
      .findByIdAndUpdate(rendId, { rating })
      .findOneAndUpdate({ _id: rendId }, {
        $inc: { commentsCount: 1 },
      })
      .exec();
  }

  async findDescByCreateDTTM($limit = DEFAULT_RENTS_COUNT): Promise<DocumentType<RentEntity>[]> {
    return this.rentModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { rentId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$rentId', '$$rentId'] } } },
              { $group: { _id: null, averageRating: { $avg: '$rating' }, commentsCount: { $sum: 1 } } },
            ],
            as: 'comments'
          }
        },
        {
          $addFields: {
            id: { $toString: '$_id'},
            commentsCount: { $arrayElemAt: ['$comments.commentsCount', 0] },
            averageRating: { $arrayElemAt: ['$comments.averageRating', 0] },
          }
        },
        {
          $unset: 'comments'
        },
        {
          $limit
        },
      ])
      .exec();
  }

  async updateById(rentId: string, dto: UpdateRentDto): Promise<DocumentType<RentEntity> | null> {
    return await this.rentModel
      .findByIdAndUpdate(rentId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  async deleteRentById(rentId: string): Promise<DocumentType<RentEntity> | null> {
    return await this.rentModel
      .findByIdAndDelete(rentId)
      .exec();
  }

  async findFavoriteRent($limit = DEFAULT_RENTS_COUNT): Promise<DocumentType<RentEntity>[]> {
    return await this.rentModel
      .find({
        isFavorite: true
      })
      .limit($limit)
      .sort({
        createdAt: SortType.DESC
      })
      .populate(['userId'])
      .exec();
  }

  async findById(rentId: string): Promise<DocumentType<RentEntity> | null> {
    return this.rentModel.findById(rentId);
  }

  async exists(rentId: string): Promise<boolean> {
    return !!await this.rentModel.exists({_id: rentId});
  }

  public async findPremiumRentsByCity(city: City): Promise<DocumentType<RentEntity>[]> {
    return await this.rentModel
      .aggregate([
        { $match: { city, isPremium: true } },
        { $sort: { createdAt: SortType.DESC } },
        { $limit: DEFAULT_RENTS_COUNT },
      ])
      .exec();
  }
}
