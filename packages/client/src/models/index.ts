import * as Users from './users';
import * as Messages from './messages';

export * from './users/users.types';
export const users = Users;

export * from './messages/messages.types';
export const messages = Messages;

export default {
  users,
  messages,
};
