import http from 'http';
import { Application, Router } from 'express';
import { Server } from 'socket.io';
import { config } from '../config';
import { registerEndpointAll } from './api-register';
import * as lobby from './lobby';
import users from './users';
import messages from './messages';

export const Route = '/api';

export const initRest = (app: Application) => {
  const router = Router();

  registerEndpointAll(router, users.API);
  registerEndpointAll(router, messages.API);
  app.use(Route, router);
};

export const initSockets = (app: Application, server: http.Server) => {
  const io = new Server({
    cors: {
      origin: config.mode === 'development' ? `http://localhost:${config.port}` : 'https://osgchat.herokuapp.com',
      methods: ['GET', 'POST']
    }
  });

  lobby.init(app, io);
  io.listen(server);
  app.set('socketio', io);
};

export default {
  initRest,
  initSockets,
};