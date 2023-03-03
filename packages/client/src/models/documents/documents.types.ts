import { User } from '../users/users.types';

export type DocumentData = Uint8Array;

export type Document = {
  data?: {
    data: DocumentData;
    type: 'Buffer';
  };
};

export type DocumentSelection = {
  range: {
    index: number;
    length: number;
  };
  user: User;
};