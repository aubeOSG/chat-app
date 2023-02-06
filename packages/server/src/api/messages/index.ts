import * as API from './messages-api';
import * as Socket from './messages-socket';

export * from './messages.types';

export const api = API;
export const socket = Socket;

export default {
  api,
  socket,
};