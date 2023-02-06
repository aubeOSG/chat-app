import { Server, Socket } from 'socket.io';
import utils from '../../utils';
import users, { User } from '../users';
import api from './messages-api';

export const init = (io: Server, socket: Socket, user: User) => {
  socket.on('message-send', (data) => {
    const userId = data.message.userId || user.id;
    const userIdx = utils.list.indexBy(users.api._users, 'id', userId);
    const userData = users.api._users[userIdx];
    const newMessage = {
      user: {
        id: userData.id,
        info: userData.info,
      },
      datetime: new Date().toISOString(),
      content: data.message.content,
    };

    api._add(newMessage);
    io.emit('message-new', { message: newMessage });
  })
};

export default {
  init,
};