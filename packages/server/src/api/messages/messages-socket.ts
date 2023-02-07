import { Server, Socket } from 'socket.io';
import { User } from '../users';
import api from './messages-api';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.on('message-send', (data) => {
    const res = api._add(data.message);

    if (res.error || !res.data) {
      socket.emit('message-new', res);
      return;
    }

    io.to(res.data.message.roomId).emit('message-new', res);
  });
};

export default {
  init,
};