import express from 'express';
import { Message } from './messages.types';
import { RegisterEndpoints } from '../api.types';

export const _messages: Array<Message> = [];

export const list: express.Handler = (req, res) => {
  res.send({
    messages: _messages,
  });
};

export const _add = (message: Message) => {
  _messages.push(message);
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
