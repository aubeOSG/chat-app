import * as Api from './rooms-api';
import * as Socket from './rooms-socket';

export * from './rooms.types';

export const api = Api;
export const socket = Socket;

export default {
  api,
  socket,
};
