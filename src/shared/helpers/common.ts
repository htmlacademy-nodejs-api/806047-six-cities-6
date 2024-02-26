import crypto from 'node:crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean() {
  return Math.random() < 0.5;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

// https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
export function generatePassword(
  length = 20,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) {
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');
}


export function createErrorObject(message: string) {
  return {
    error: message,
  };
}


export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}
