import * as mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { RentService } from './rent.service.interface.js';
import { Component } from '../../types/components.emun.js';
import { Logger } from '../../lib/logger/index.js';
import { CreateRentDto } from './index.js';
import { RentEntity } from './rent.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';

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

  public async findByUserId(userId: string): Promise<RentEntity[] | null> {
    return await this.rentModel.find({ userId: new mongoose.Types.ObjectId(userId) });
  }
}