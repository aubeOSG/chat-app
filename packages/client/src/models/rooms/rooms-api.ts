import { AxiosPromise } from "axios";
import { User } from '../users';
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

export const join = (room: Room, user: User) => {
  if (!socketer.hooks.io) {
    console.warn('unable to join room: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('room-join', { room, user });
};

export const leave = (room: Room, user: User) => {
  if (!socketer.hooks.io) {
    console.warn('unable to leave room: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('room-leave', { room, user });
};

export default {
  list,
  create,
  leave,
};