import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { RentEntity } from '../rent/rent.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024, trim: true })
  public text: string;

  @prop({ required: true, min: 1, max: 5 })
  public raiting: number;

  @prop({ref: 'UserEntity', required: true })
  public userId: Ref<UserEntity>;

  @prop({ref: 'RentEntity', required: true })
  public rentId: Ref<RentEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
