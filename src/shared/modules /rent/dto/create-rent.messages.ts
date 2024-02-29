import { City } from '../../../types/city.enum.js';
import { Convenience } from '../../../types/conveniences.enum.js';
import { HousingType } from '../../../types/housing-type.enum.js';

export const CreateRentValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  city: {
    isEnum: `type must be [${Object.values(City).join(',')}]`,
  },
  previewImage: {
    isString: 'type must be string',
  },

  propertyImages: {
    isString: 'type must be string',
  },

  isPremium: {
    isBoolean: 'type must be boolean'
  },

  isFavorite: {
    isBoolean: 'type must be boolean'
  },

  rating: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 5',
  },

  housingType: {
    isEnum: `housingType must be an [${Object.values(HousingType).join(',')}]`,
  },

  roomsNumber: {
    invalidFormat: 'roomsNumber must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 8',
  },

  guestsNumber: {
    invalidFormat: 'guestsNumcber must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 10',
  },

  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },

  conveniences: {
    isEnum: `Field categories must be an [${Object.values(Convenience).join(',')}]`,
  },

  longitude:  {
    isInt: 'longitude must be an integer',
  },

  latitude:  {
    isInt: 'longitude must be an integer',
  },

  userId: {
    isMongoId: 'userId field must be a valid id',
  },
} as const;


