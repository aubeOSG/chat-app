import { AvatarData, Avatars } from './avatars.types';
import data from './avatars-data.json';
import utils from '../../utils';

export const get = (key: string): AvatarData | undefined => {
  if (!utils.obj.hasProp(data, key)) {
    return;
  }

  return data[key];
};

export const getColor = (key: string): string | undefined => {
  if (!utils.obj.hasProp(data, key)) {
    return;
  }

  return data[key].color;
};

export const list = (): Avatars => {
  return data;
};

export default {
  get,
  list,
  getColor,
};