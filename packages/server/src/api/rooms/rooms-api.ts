import express from 'express';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';
import { Room } from './rooms.types';
import { User } from '../users';

export const _rooms: Array<Room> = [];

export const _add = (roomName: string, user: User) => {
  const roomIdx = utils.list.indexBy(_rooms, 'name', roomName);

  if (roomIdx !== -1) {
    return {
      error: true,
      message: 'unable to create room: room with the name already exists',
    };
  }

  const newRoom = {
    id: utils.str.toKebabCase(roomName),
    name: roomName,
    userIds: [
      user.id,
    ],
  };

  _rooms.push(newRoom);

  return {
    error: false,
    data: {
      room: newRoom,
    },
  };
};

export const _join = (room: Room, user: User) => {
  const roomIdx = utils.list.indexBy(_rooms, 'id', room.id);

  if (roomIdx === -1) {
    return {
      error: true,
      message: 'unable to join room: room not found',
    };
  }

  const userIdx = _rooms[roomIdx].userIds.indexOf(user.id);

  if (userIdx === -1) {
    _rooms[roomIdx].userIds.push(user.id);
    room = _rooms[roomIdx];
  }

  return {
    error: false,
    data: {
      room,
      user,
    },
  }
};

export const _leave = (room: Room, user: User) => {
  const roomIdx = utils.list.indexBy(_rooms, 'id', room.id);

  if (roomIdx === -1) {
    return {
      error: true,
      message: 'unable to leave room: room not found',
    };
  }

  const userIdx = _rooms[roomIdx].userIds.indexOf(user.id);

  if (userIdx === -1) {
    return {
      error: true,
      message: 'unable to leave room: user not found',
    };
  }

  _rooms[roomIdx].userIds.splice(userIdx, 1);
  room = _rooms[roomIdx];

  return {
    error: false,
    data: {
      room,
      user,
    },
  }
};

export const _remove = (roomId: string) => {
  const roomIdx = utils.list.indexBy(_rooms, 'id', roomId);

  if (roomIdx === -1) {
    return {
      error: true,
      message: 'unable to remove room: room not found',
    };
  }

  const room = _rooms.splice(roomIdx, 1);

  return {
    error: false,
    data: {
      room,
    },
  };
};

export const list: express.Handler = (req, res) => {
  res.send({
    rooms: _rooms,
  });
};

export const endpoints: RegisterEndpoints = {
  list: {
    name: '/rooms',
    method: 'GET',
    fn: list,
  },
};

export default {
  _rooms,
  endpoints,
  _add,
  _join,
  _leave,
  _remove,
  list,
};