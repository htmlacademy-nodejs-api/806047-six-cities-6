import { Convenience } from './conveniences.enum.js';
import { City } from './city.enum.js';
import { Coordinates } from './coordinates.type.js';
import { HousingType } from './housing-type.enum.js';

export type RentalOffer = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  propertyImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  price: number;
  conveniences: Convenience[];
  commentsCount: number;
  coordinates: Coordinates;
}
