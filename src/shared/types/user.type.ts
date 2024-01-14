import { UserType } from './user-type.enum.js';

export type AvatarExtention = `${string}.${'jpg' | 'png'}`;

export type User = {
  name: string;
  email: string;
  avatar?: AvatarExtention;
  password: string;
  userType: UserType;
}
