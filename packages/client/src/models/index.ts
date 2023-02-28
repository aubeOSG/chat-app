import * as Users from './users';
import * as Messages from './messages';
import * as Avatars from './avatars';
import * as Lobby from './lobby';
import * as Rooms from './rooms';
import * as Documents from './documents';

export * from './users/users.types';
export const users = Users;

export * from './messages/messages.types';
export const messages = Messages;

export * from './avatars/avatars.types';
export const avatars = Avatars;

export const lobby = Lobby;

export * from './rooms/rooms.types';
export const rooms = Rooms;

export * from './documents/documents.types';
export const documents = Documents;

export default {
  users,
  messages,
  avatars,
  lobby,
  rooms,
  documents,
};
