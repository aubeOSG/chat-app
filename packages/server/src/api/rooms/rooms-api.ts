import express from 'express';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';
import { Room } from './rooms.types';
import users, { User } from '../users';
import messages from '../messages';

export const _rooms: Array<Room> = [
  {
    id: 'general',
    name: 'General',
    userIds: [],
    isDefault: true,
  }
];

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

  user.rooms.push(newRoom.id);
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

  const userRoomIdx = user.rooms.indexOf(room.id);

  if (userRoomIdx === -1) {
    user.rooms.push(room.id);
    users.api._update(user);
  }

  return {
    error: false,
    data: {
      room,
      user,
      rooms: _rooms,
    },
  }
};

export const _leave = (room: Room, user: User) => {
  let isDeleted = false;
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
  const userRoomIdx = user.rooms.indexOf(room.id);

  if (userRoomIdx !== -1) {
    user.rooms.splice(userRoomIdx, 1);
    users.api._update(user);
  }

  if (!_rooms[roomIdx].userIds.length && !_rooms[roomIdx].isDefault) {
    _rooms.splice(roomIdx, 1);
    isDeleted = true;
    messages.api._removeRoom(room);
  }

  return {
    error: false,
    data: {
      isDeleted,
      room,
      user,
      rooms: _rooms,
    },
  }
};

export const _leaveAll = (user: User) => {
  const roomsCnt = user.rooms.length - 1;

  if (roomsCnt === -1) {
    return;
  }

  let roomIdx = -1;

  for (let i = roomsCnt; i > -1; i--) {
    roomIdx = utils.list.indexBy(_rooms, 'id', user.rooms[i]);

    if (roomIdx !== -1) {
      _leave(_rooms[roomIdx], user);
    }
  }

  return {
    error: false,
    data: {
      user,
      rooms: _rooms,
    }
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
  _leaveAll,
  _remove,
  list,
};