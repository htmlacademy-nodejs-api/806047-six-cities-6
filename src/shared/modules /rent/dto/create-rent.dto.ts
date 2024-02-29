import { HousingType, City, Convenience } from '../../../types/index.js';
import {
  Max,
  Min,
  IsEnum,
  IsString,
  IsInt,
  IsMongoId,
  MaxLength,
  MinLength,
  IsBoolean,
  IsArray
} from 'class-validator';

import { CreateRentValidationMessage } from './create-rent.messages.js';
import { RentDtoConst } from './create-rent.const.js';


export class CreateRentDto {
  @MinLength(RentDtoConst.MinLengthTitle, { message: CreateRentValidationMessage.title.minLength })
  @MaxLength(RentDtoConst.MaxLengthTitle, { message: CreateRentValidationMessage.title.maxLength })
  public title: string;


  @MinLength(RentDtoConst.MinLengthDescription, { message: CreateRentValidationMessage.description.minLength })
  @MaxLength(RentDtoConst.MaxLengthDescription, { message: CreateRentValidationMessage.description.maxLength })
  public description: string;

  @IsEnum(City, { message: CreateRentValidationMessage.city.isEnum })
  public city: City;

  @IsString({ message: CreateRentValidationMessage.previewImage.isString })
  public previewImage: string;

  @IsArray({each: true, message: CreateRentValidationMessage.propertyImages.isString })
  public propertyImages: string[];

  @IsBoolean({ message: CreateRentValidationMessage.isFavorite.isBoolean })
  public isFavorite: boolean;

  @IsBoolean({ message: CreateRentValidationMessage.isPremium.isBoolean })
  public isPremium: boolean;

  @IsEnum(HousingType, { message: CreateRentValidationMessage.housingType.isEnum })
  public housingType: HousingType;

  @Min(RentDtoConst.MinRoomsNumber, { message: CreateRentValidationMessage.roomsNumber.minValue })
  @Max(RentDtoConst.MaxRoomsNumber, { message: CreateRentValidationMessage.roomsNumber.maxValue })
  public roomsNumber: number;

  @Min(RentDtoConst.MinGuestsNumber, { message: CreateRentValidationMessage.guestsNumber.minValue })
  @Max(RentDtoConst.MaxGuestsNumber, { message: CreateRentValidationMessage.guestsNumber.maxValue })
  public guestsNumber: number;

  @Min(RentDtoConst.MinPrice, { message: CreateRentValidationMessage.price.minValue })
  @Max(RentDtoConst.MaxPrice, { message: CreateRentValidationMessage.price.maxValue })
  public price: number;


  @IsEnum(Convenience, {each: true, message: CreateRentValidationMessage.conveniences.isEnum})
  public conveniences: Convenience[];

  @IsMongoId({ message: CreateRentValidationMessage.userId.isMongoId })
  public userId: string;

  @IsInt({ message: CreateRentValidationMessage.latitude.isInt })
  public latitude: number;

  @IsInt({ message: CreateRentValidationMessage.longitude.isInt })
  public longitude: number;
}
