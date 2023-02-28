import { Server, Socket } from 'socket.io';
import { User } from '../users';
import api from './documents-api';
import { api as roomApi } from '../rooms';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.on('document-changed', (req) => {
    const res = api._add(req, user);
    console.debug('document changed');
    io.to(roomApi._rooms[0].id).emit('document-updated', res);
  });
};

export default {
  init,
};