import http from 'http';
import { Application, Router } from 'express';
import { Server } from 'socket.io';
import { config } from '../config';
import { registerEndpointAll } from './api-register';
import * as lobby from './lobby';
import * as users from './users';

export const Route = '/api';

export const init = (app: Application) => {
  const router = Router();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: config.mode === 'development' ? `http://localhost:${config.port}` : '',
      methods: ['GET', 'POST']
    }
  });

  lobby.init(app, io);
  registerEndpointAll(router, users.API);
  app.use(Route, router);

  server.listen(config.socket, () => {
    console.log(`socket listening on: ${config.socket}`);
  });
};

export default {
  init,
};