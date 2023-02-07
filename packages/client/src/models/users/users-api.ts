import { AxiosPromise } from "axios";
import { User } from './users.types';
import { requester, socketer } from '../../services';

export const endpoint = '/users';

export const list = (): AxiosPromise<{ users: Array<User> }> => {
  return requester.GET(endpoint);
};

export const update = (user: User) => {
  socketer.hooks.io.emit('user-update', { user });
};

export default {
  list,
  update,
};