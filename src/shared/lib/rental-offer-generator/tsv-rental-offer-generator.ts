import dayjs from 'dayjs';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { generatePassword, generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../helpers/common.js';
import { RentalOfferGenerator } from './rental-offer-generator.interface.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Convenience } from '../../types/conveniences.enum.js';
import { UserType } from '../../types/user-type.enum.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_VALUE = 1;
const MAX_VALUE = 10;

export class TsvRentalOfferGenerator implements RentalOfferGenerator {
  constructor(
    private mockRentalOffer: MockServerData
  ) {}

  generate() {
    const title = getRandomItem<string>(this.mockRentalOffer.titles);
    const description = getRandomItem<string>(this.mockRentalOffer.descriptions);
    const city = getRandomItem<string>(this.mockRentalOffer.cities);
    const previewImage = getRandomItem<string>(this.mockRentalOffer.previews);
    const apartmentImages = getRandomItems(this.mockRentalOffer.images).join(';');
    const housingType = getRandomItem(Object.keys(HousingType));
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_VALUE, MAX_VALUE);
    const roomsNumber = generateRandomValue(MIN_VALUE, MAX_VALUE);
    const guestsNumber = generateRandomValue(MIN_VALUE, MAX_VALUE);
    const price = generateRandomValue(MIN_VALUE, MAX_VALUE);
    const conveniences = getRandomItems(Object.keys(Convenience)).join(';');

    const userName = getRandomItem<string>(this.mockRentalOffer.names);
    const userAvatar = getRandomItem<string>(this.mockRentalOffer.avatars);
    const userEmail = getRandomItem<string>(this.mockRentalOffer.emails);
    const userType = getRandomItem<string>(Object.keys(UserType));

    const user = {
      userName,
      userEmail,
      userAvatar,
      password: generatePassword(generateRandomValue(MIN_VALUE, MAX_VALUE)),
      userType,
    };

    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const commentsCount = generateRandomValue(MIN_VALUE, MAX_VALUE);

    const coordinates = Object.values({
      latitude: generateRandomValue(MIN_VALUE, MAX_VALUE), longitude: generateRandomValue(MIN_VALUE, MAX_VALUE)
    });

    return [
      title, description, postDate,
      city, previewImage, apartmentImages,
      isFavorite, isPremium, rating,
      housingType, roomsNumber, guestsNumber,
      price, conveniences, Object.values(user).join('\t'), commentsCount,
      Object.values(coordinates).join('\t')
    ].join('\t');
  }
}
