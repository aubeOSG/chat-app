import express from 'express';
import { RegisterEndpoints } from '../api.types';

const users = [];

export const list: express.Handler = (req, res) => {
  res.send({
    users,
  });
};

export const API: RegisterEndpoints = {
  list: {
    name: '/users',
    method: 'GET',
    fn: list,
  },
};

export default {
  API,
  list,
};
