import { HousingType, City, Convenience } from '../../../types/index.js';

export class UpdateRentDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public propertyImages?: string[];
  public isFavorite?: boolean;
  public isPremium?: boolean;
  public rating?: number;
  public housingType?: HousingType;
  public roomsNumber?: number;
  public guestsNumber?: number;
  public price?: number;
  public conveniences?: Convenience[];
  public userId?: string;
  public latitude?: number;
  public longitude?: number;

}
