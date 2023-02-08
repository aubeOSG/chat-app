import { Server, Socket } from 'socket.io';
import { User } from '../users';
import api from './rooms-api';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.join(api._rooms[0].id);

  socket.on('room-create', (data) => {
    const res = api._add(data.name, user);

    if (!res.error && res.data) {
      socket.join(res.data.room.id);
    }

    setTimeout(() => {
      io.emit('room-new', res);
      socket.emit('room-created', res);
    }, 500);
  });

  socket.on('room-join', (data) => {
    const res = api._join(data.room, data.user);

    if (!res.error) {
      socket.join(data.room.id);
    }
    
    setTimeout(() => {
      socket.emit('room-joined', res);
      io.to(data.room.id).emit('room-member-joined', res);
    }, 150);
  });

  socket.on('room-leave', (data) => {
    const res = api._leave(data.room, data.user);

    if (!res.error) {
      socket.leave(data.room.id);
    }
    
    setTimeout(() => {
      io.to(data.room.id).emit('room-member-left', res);
      io.emit('room-left', res);
    }, 150);
  });
};

export default {
  init,
};