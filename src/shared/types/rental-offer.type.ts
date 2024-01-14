import { Conveniences } from './conveniences.enum.js';
import { City } from './city.enum.js';
import { Coordinates } from './coordinates.type.js';
import { Housing } from './housing-type.enum.js';
import { User } from './user.type.js';

export type RentalOffer = {
  title: string;
  postDate: Date;
  city: City;
  previewImage: string;
  propertyImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: Housing;
  roomsNumber: number;
  guestsNumber: number;
  price: number;
  conveniences: Conveniences[];
  user: User;
  commentsCount: number;
  coordinates: Coordinates;
}
