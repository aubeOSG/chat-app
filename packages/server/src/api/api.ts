import http from 'http';
import { Application, Router } from 'express';
import { Server } from 'socket.io';
import { config } from '../config';
import { registerEndpointAll } from './api-register';
import lobby from './lobby';
import users from './users';
import messages from './messages';
import rooms from './rooms';

export const Route = '/api';

export const initRest = (app: Application) => {
  const router = Router();

  registerEndpointAll(router, users.api.endpoints);
  registerEndpointAll(router, messages.api.endpoints);
  registerEndpointAll(router, rooms.api.endpoints);
  app.use(Route, router);
};

export const initSockets = (app: Application, server: http.Server) => {
  const io = new Server({
    cors: {
      origin: config.mode === 'development' ? `http://localhost:${config.port}` : 'https://osgchat.herokuapp.com',
      methods: ['GET', 'POST']
    }
  });

  io.on('connect_error', (err) => {
    console.log('socket connection error', err.message);
  });

  io.on('connection', (socket) => {
    console.log('a user joined');
    const newUser = {
      id: socket.id,
      info: users.api._generateInfo(),
      rooms: [rooms.api._rooms[0].id],
    };

    rooms.api._rooms[0].userIds.push(newUser.id);
    users.api._add(newUser);

    socket.on('disconnect', () => {
      setTimeout(() => {
        console.log('a user left', newUser.id);
        const res = rooms.api._leaveAll(newUser);
      
        users.api._remove(newUser.id);
        io.emit('lobby-left', res);
      }, 150);
    });

    lobby.socket.init(io, socket, newUser);
    users.socket.init(io, socket, newUser);
    messages.socket.init(io, socket, newUser);
    rooms.socket.init(io, socket, newUser);
  });

  io.listen(server);
  app.set('socketio', io);
};

export default {
  initRest,
  initSockets,
};