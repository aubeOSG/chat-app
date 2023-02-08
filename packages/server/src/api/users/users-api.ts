import express from 'express';
import { User, UserInfo } from './users.types';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';
import adjectives from './user-adjectives';
import avatars from './user-avatars';
import rooms from '../rooms';

const adjectiveCnt = adjectives.list.length - 1;
const avatarCnt = avatars.list.length - 1;

export const _users: Array<User> = [];

const getRandomIndex = (list) => {
  const cnt = list.length - 1;
  let idx = Math.floor(Math.random() * cnt) + 1;

  if (!list[idx]) {
    idx = Math.floor(Math.random() * cnt);
  }

  return idx;
}

export const _generateInfo = () => {
  const createInfo = (): UserInfo | undefined => {
    const adjectiveIdx = getRandomIndex(adjectives.list);
    const adjective = adjectives.list[adjectiveIdx];
    const avatarIdx = getRandomIndex(avatars.list);
    const avatar = avatars.list[avatarIdx];

    if (!adjective || !avatar) {
      return;
    }

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
    const temp = createInfo();

    if (!temp) {
      continue;
    }

    info = temp;
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
