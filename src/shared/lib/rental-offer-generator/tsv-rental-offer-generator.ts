import { City, MockServerData } from '../../types/mock-server-data.type.js';
import { generatePassword, generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { RentalOfferGenerator } from './rental-offer-generator.interface.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Convenience } from '../../types/conveniences.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import {
  GenerateMockCommentsCount,
  GenerateMockCountPassword,
  GenerateMockGuestsCount,
  GenerateMockPriceCount,
  GenerateMockRatingCount,
  GenerateMockRoomsCount
} from './tsv-rental-offer.enum.js';


export class TsvRentalOfferGenerator implements RentalOfferGenerator {
  constructor(
    private mockRentalOffer: MockServerData
  ) {}

  generate() {
    const title = getRandomItem<string>(this.mockRentalOffer.titles);
    const description = getRandomItem<string>(this.mockRentalOffer.descriptions);
    const {
      name: city,
      location: {
        latitude,
        longitude
      }
    } = getRandomItem<City>(this.mockRentalOffer.cities);
    const previewImage = getRandomItem<string>(this.mockRentalOffer.previews);
    const apartmentImages = getRandomItems(this.mockRentalOffer.images).join(';');
    const housingType = getRandomItem(Object.keys(HousingType));
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(GenerateMockRatingCount.MinValue, GenerateMockRatingCount.MaxValue);
    const roomsNumber = generateRandomValue(GenerateMockRoomsCount.MinValue, GenerateMockRoomsCount.MaxValue);
    const guestsNumber = generateRandomValue(GenerateMockGuestsCount.MinValue, GenerateMockGuestsCount.MaxValue);
    const price = generateRandomValue(GenerateMockPriceCount.MinValue, GenerateMockPriceCount.MaxValue);
    const conveniences = getRandomItems(Object.keys(Convenience)).join(';');

    const userName = getRandomItem<string>(this.mockRentalOffer.names);
    const userAvatar = getRandomItem<string>(this.mockRentalOffer.avatars);
    const userEmail = getRandomItem<string>(this.mockRentalOffer.emails);
    const userType = getRandomItem<string>(Object.keys(UserType));

    const user = {
      userName,
      userEmail,
      userAvatar,
      password: generatePassword(generateRandomValue(GenerateMockCountPassword.MinValue, GenerateMockCountPassword.MaxValue)),
      userType,
    };

    const commentsCount = generateRandomValue(GenerateMockCommentsCount.MinValue, GenerateMockCommentsCount.MaxValue);

    return [
      title, description, city, previewImage, apartmentImages,
      isFavorite, isPremium, rating,
      housingType, roomsNumber, guestsNumber,
      price, conveniences, Object.values(user).join('\t'), commentsCount,
      latitude, longitude,
    ].join('\t');
  }
}
