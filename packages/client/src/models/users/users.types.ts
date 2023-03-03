import { Avatar } from '../avatars/avatars.types';

export type UserInfo = {
  name: string;
  avatar: Avatar;
};

export type User = {
  id: string;
  info: UserInfo;
  rooms: Array<string>;
};