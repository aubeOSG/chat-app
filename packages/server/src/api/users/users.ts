import express from 'express';
import { User } from './users.types';
import { RegisterEndpoints } from '../api.types';
import utils from '../../utils';

export const _users: Array<User> = [];

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

export const API: RegisterEndpoints = {
  list: {
    name: '/users',
    method: 'GET',
    fn: list,
  },
};

export default {
  _users,
  API,
  list,
  _add,
  _remove,
};
