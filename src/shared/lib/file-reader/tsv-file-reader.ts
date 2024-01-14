import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { RentalOffer } from '../../types/rental-offer.type.js';
import { City } from '../../types/city.enum.js';
import { AvatarExtention } from '../../types/user.type.js';
import { Housing } from '../../types/housing-type.enum.js';
import { Conveniences } from '../../types/conveniences.enum.js';
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
      ]) => {

        console.log(City, conveniences);
        return ({
          title,
          description,
          postDate: new Date(postDate),
          city: City[city as keyof typeof City],
          previewImage,
          propertyImages: propertyImages.split(';'),
          isPremium: Boolean(isPremium),
          isFavorite: Boolean(isFavorite),
          rating: Number.parseFloat(rating),
          housingType: Housing[housingType as keyof typeof Housing],
          roomsNumber: Number.parseInt(roomsNumber, 10),
          guestsNumber: Number.parseInt(guestsNumber, 10),
          price: Number.parseInt(price, 10),
          conveniences: conveniences.split(';').filter(Boolean).map((conv) => Conveniences[conv as keyof typeof Conveniences]),
          user: {
            name,
            email,
            avatar: avatar as AvatarExtention,
            password,
            userType: UserType[userType as keyof typeof UserType]
          },
          commentsCount: Number.parseInt(commentsCount, 10),
          coordinates: { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) },
        });
      });
  }
}
