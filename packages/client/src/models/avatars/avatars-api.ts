import { Avatar, Avatars } from './avatars.types';
import data from './avatars-data.json';
import utils from '../../utils';

export const get = (key: string): Avatar | undefined => {
  if (!utils.obj.hasProp(data, key)) {
    return;
  }

  return data[key];
};

export const list = (): Avatars => {
  return data;
};

export default {
  get,
  list,
};