import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, HousingType, Convenience } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 10, maxlength: 100, trim: true })
  public title: string;

  @prop({ required: true, minlength: 20, maxlength: 1024, trim: true, select: false })
  public description: string;

  @prop({
    required: true,
    enum: City,
    type: () => String
  })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true })
  public propertyImages: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating: number;

  @prop({ required: true })
  public housingType: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsNumber: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestsNumber: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price: number;

  @prop({ required: true })
  public conveniences: Convenience[];


  @prop({ required: true })
  public coordinates: {
    latitude: number;
    longitude: number;
  };

  @prop({default: 0, required: false})
  public commentsCount: number;

  @prop({ref: 'UserEntity', required: true })
  public userId: Ref<UserEntity>;
}

export const RentModel = getModelForClass(RentEntity);
