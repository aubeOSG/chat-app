import * as API from './users-api';
import * as Socket from './users-socket';

export * from './users.types';

export const api = API;
export const socket = Socket;

export default {
  api,
  socket,
};