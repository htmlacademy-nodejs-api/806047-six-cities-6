import { City } from '../types/city.enum.js';
import { Convenience } from '../types/conveniences.enum.js';
import { HousingType } from '../types/housing-type.enum.js';
import { RentalOffer } from '../types/rental-offer.type.js';

export function createRentalOffer(offer: string): RentalOffer {
  const [
    title,
    description,
    city,
    previewImage,
    propertyImages,
    isPremium,
    isFavorite,
    rating,
    housingType,
    roomsNumber,
    guestsNumber,
    price,
    conveniences,
    commentsCount,
    latitude,
    longitude,
  ] = offer.replace('\n', '').split('\t');

  return {
    title,
    description,
    city: City[city as keyof typeof City],
    previewImage,
    propertyImages: propertyImages.split(';'),
    isPremium: JSON.parse(isPremium),
    isFavorite: JSON.parse(isFavorite),
    rating: Number.parseFloat(rating),
    housingType: HousingType[housingType as keyof typeof HousingType],
    roomsNumber: Number(roomsNumber),
    guestsNumber: Number(guestsNumber),
    price: Number(price),
    conveniences: conveniences.split(';').map((conv) => Convenience[conv as keyof typeof Convenience]),
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) },
  };
}
