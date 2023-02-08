import express from 'express';
import { v4 as uuid } from 'uuid';
import { Message, NewMessage } from './messages.types';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';
import users from '../users';
import rooms, { Room } from '../rooms';

export const _messages: Array<Message> = [];

export const list: express.Handler = (req, res) => {
  const roomId = req.query.roomId;

  if (!roomId) {
    res.send({
      error: true,
      message: 'unable to get messages: room id is required',
    });
    return;
  }

  const roomIdx = utils.list.indexBy(rooms.api._rooms, 'id', roomId);

  if (roomIdx === -1) {
    res.send({
      error: true,
      message: 'unable to get messages: room not found',
    });
    return;
  }

  res.send({
    messages: _messages.filter((message: Message) => {
      return message.roomId === roomId;
    }),
  });
};

export const _add = (newMessage: NewMessage) => {
  const userIdx = utils.list.indexBy(users.api._users, 'id', newMessage.user.id);

  if (userIdx === -1) {
    return {
      error: true,
      message: 'unable to send message: user not found',
    };
  }

  const roomIdx = utils.list.indexBy(rooms.api._rooms, 'id', newMessage.roomId);

  if (roomIdx === -1) {
    return {
      error: true,
      message: 'unable to send message: room not found',
    };
  }

  const message: Message = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    roomId: newMessage.roomId,
    user: {
      id: newMessage.user.id,
      info: newMessage.user.info,
    },
    content: newMessage.content,
  };

  _messages.push(message);
  return {
    error: false,
    data: {
      message,
    }
  };
};

export const _removeRoom = (room: Room) => {
  const mesCnt = _messages.length - 1;

  if (mesCnt === -1) {
    return;
  }

  for (let i = mesCnt; i > -1; i--) {
    if (_messages[i].roomId === room.id) {
      _messages.splice(i, 1);
    }
  }
};

export const endpoints: RegisterEndpoints = {
  list: {
    name: '/messages',
    method: 'GET',
    fn: list,
  },
};

export default {
  _messages,
  endpoints,
  list,
  _add,
};
