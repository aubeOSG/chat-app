import * as Users from './users';
import * as Messages from './messages';
import * as Avatars from './avatars';

export * from './users/users.types';
export const users = Users;

export * from './messages/messages.types';
export const messages = Messages;

export * from './avatars/avatars.types';
export const avatars = Avatars;

export default {
  users,
  messages,
  avatars,
};
