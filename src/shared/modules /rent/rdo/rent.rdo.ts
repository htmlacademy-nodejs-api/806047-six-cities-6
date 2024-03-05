import { Expose, Type } from 'class-transformer';
import { City, HousingType, } from '../../../types/index.js';

export class RentRdo {
  @Expose({ name: '_id' })
  @Type(() => String)
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public createdDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount?: number;
}
