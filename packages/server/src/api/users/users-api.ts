import express from 'express';
import { User, UserInfo } from './users.types';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';
import adjectives from './user-adjectives';
import avatars from './user-avatars';

const adjectiveCnt = adjectives.list.length;
const avatarCnt = avatars.list.length;

export const _users: Array<User> = [];

export const _generateInfo = () => {
  const createInfo = (): UserInfo => {
    const adjectiveIdx = Math.floor(Math.random() * adjectiveCnt) - 1;
    const adjective = adjectives.list[adjectiveIdx];
    const avatarIdx = Math.floor(Math.random() * avatarCnt) - 1;
    const avatar = avatars.list[avatarIdx];

    return {
      name: `${adjective} ${avatar.label}`,
      avatar,
    };
  }

  let userLookup = -1;
  let info: UserInfo = {
    name: '',
    avatar: {
      key: '',
      label: ''
    },
  };

  for (let i = 0, ii = (adjectiveCnt * avatarCnt); i < ii; i++) {
    info = createInfo();
    userLookup = utils.list.indexBy(_users, 'name', info.name);

    if (userLookup === -1) {
      break;
    }
  }

  return info;
};

export const list: express.Handler = (req, res) => {
  res.send({
    users: _users,
  });
};

export const _add = (user: User) => {
  _users.push(user);
};

export const _remove = (userId: string) => {
  const userIdx = utils.list.indexBy(_users, 'id', userId);

  if (userIdx === -1) {
    return;
  }

  _users.splice(userIdx, 1);
};

export const _update = (user: User) => {
  const userIdx = utils.list.indexBy(_users, 'id', user.id);

  if (userIdx === -1) {
    return {
      error: true,
      message: 'unable to update user: user not found',
    };
  }

  _users.splice(userIdx, 1, user);

  return {
    error: false,
    data: {
      user,
    }
  }
};

export const endpoints: RegisterEndpoints = {
  list: {
    name: '/users',
    method: 'GET',
    fn: list,
  },
};

export default {
  _users,
  _generateInfo,
  endpoints,
  list,
  _add,
  _remove,
  _update,
};
