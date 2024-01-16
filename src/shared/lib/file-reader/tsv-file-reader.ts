import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { RentalOffer } from '../../types/rental-offer.type.js';
import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Convenience } from '../../types/conveniences.enum.js';
import { UserType } from '../../types/user-type.enum.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }


    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        postDate,
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
        name,
        email,
        avatar,
        password,
        userType,
        commentsCount,
        latitude,
        longitude
      ]) => ({
        title,
        description,
        postDate: new Date(postDate),
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
        conveniences: conveniences.split(';').filter(Boolean).map((conv) => Convenience[conv as keyof typeof Convenience]),
        user: {
          name,
          email,
          avatar,
          password,
          userType: UserType[userType as keyof typeof UserType]
        },
        commentsCount: Number.parseInt(commentsCount, 10),
        coordinates: { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) },
      }));
  }
}
