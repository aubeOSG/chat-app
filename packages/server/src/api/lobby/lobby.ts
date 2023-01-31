import { Application } from 'express';
import { Server } from 'socket.io';

export const init = (app: Application, io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('ping', (msg) => {
      console.log('server was pinged');
      io.emit('ping', msg);
    });
  });
};

export default {
  init,
};