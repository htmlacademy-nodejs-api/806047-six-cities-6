import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment.service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from 'pino';
import { DEFAULT_COMMENTS_COUNT } from './commnet.const.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);

    this.logger.info(`Create new commnet with userId: ${dto.userId}`);

    return result;
  }

  async findByRentId(rentId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({ rentId })
      .sort({ createdAt: SortType.DESC })
      .limit(DEFAULT_COMMENTS_COUNT)
      .populate('userId')
      .exec();
  }
}
