import { Server, Socket } from 'socket.io';
import { User } from '.';
import api from './users-api';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.on('user-update', (data) => {
    console.debug('user updating\n', JSON.stringify(data, null, 2))
    const res = api._update(data.user);

    setTimeout(() => {
      io.emit('user-updated', res);
    }, 150);
  });
};

export default {
  init,
};