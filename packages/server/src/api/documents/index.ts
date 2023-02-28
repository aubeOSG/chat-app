import * as API from './documents-api';
import * as Socket from './documents-socket';

export * from './documents.types';

export const api = API;
export const socket = Socket;

export default {
  api,
  socket,
};