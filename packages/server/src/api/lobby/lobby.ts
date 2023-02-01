import { Application } from 'express';
import { Server } from 'socket.io';
import utils from '../../utils';
import users from '../users';
import messages from '../messages';

export const init = (app: Application, io: Server) => {
  io.on('connect_error', (err) => {
    console.log('socket connection error', err.message);
  })

  io.on('connection', (socket) => {
    console.log('a user joined');
    const newUser = {
      id: socket.id,
      name: `Anonymous User ${users._users.length + 1}`
    };

    users._add(newUser);

    socket.on('disconnect', () => {
      console.log('a user left')
      users._remove(newUser.id);
      io.emit('lobby-left');
    });

    socket.emit('user-info', { user: newUser });

    socket.on('message-send', (data) => {
      const userId = data.message.userId || newUser.id;
      const userIdx = utils.list.indexBy(users._users, 'id', userId);
      const user = users._users[userIdx];
      const newMessage = {
        userId: user.id,
        userName: user.name,
        datetime: new Date().toISOString(),
        content: data.message.content,
      };

      messages._add(newMessage);
      io.emit('message-new', { message: newMessage });
    })

    setTimeout(() => {
      console.log('sending message');
      io.emit('lobby-joined');
    }, 150);
  });
};

export default {
  init,
};