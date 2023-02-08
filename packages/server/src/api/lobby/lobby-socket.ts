import { Server, Socket } from 'socket.io';
import { User } from '../users';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.emit('user-info', { user });
  console.log('lobby joined by', user.id);
  io.emit('lobby-joined');
};

export default {
  init,
};