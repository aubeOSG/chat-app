import express from 'express';
import { Document, DocumentData } from './documents.types';
import { User } from '../users';
import { RegisterEndpoints } from '../api.types';

export const _document: Document = {
  data: undefined
};

export const list: express.Handler = (req, res) => {
  res.send({
    documents: [
      _document,
    ],
  });
};

export const _add = (doc: DocumentData, user: User, id: number) => {
  _document.data = doc;

  return {
    error: false,
    data: {
      id,
      document: doc,
      userId: user.id,
    },
  };
};

export const endpoints: RegisterEndpoints = {
  list: {
    name: '/documents',
    method: 'GET',
    fn: list,
  },
};

export default {
  _document,
  endpoints,
  list,
  _add,
};
