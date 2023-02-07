import { AxiosPromise } from "axios";
import { Room } from './rooms.types';
import { requester, socketer } from '../../services';

export const endpoint = '/rooms';

export const list = (): AxiosPromise<{ rooms: Array<Room> }> => {
  return requester.GET(endpoint);
};

export const create = (name: string) => {
  if (!socketer.hooks.io) {
    console.warn('unable to create room: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('room-create', { name });
};

export default {
  list,
  create,
};