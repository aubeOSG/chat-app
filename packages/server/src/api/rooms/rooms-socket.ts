import { Server, Socket } from 'socket.io';
import { User } from '../users';
import api from './rooms-api';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.on('room-create', (data) => {
    const res = api._add(data.name, user);

    setTimeout(() => {
      io.emit('room-new', res);
      socket.emit('room-created', res);
    }, 500);
  });
};

export default {
  init,
};