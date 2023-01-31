import http from 'http';
import { Application } from 'express';
import { Server } from 'socket.io';
import { config } from '../config';
import { init as lobbyInit } from './lobby';

export const init = (app: Application) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: config.mode === 'development' ? `http://localhost:${config.port}` : '',
      methods: ['GET', 'POST']
    }
  });

  lobbyInit(app, io);

  server.listen(config.socket, () => {
    console.log(`socket listening on: ${config.socket}`);
  });
};

export default {
  init,
};