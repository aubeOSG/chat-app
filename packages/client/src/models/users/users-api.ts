import { AxiosPromise } from "axios";
import { User } from './users.types';
import { requester } from '../../services';

export const endpoint = '/users';

export const list = (): AxiosPromise<{ users: Array<User> }> => {
  return requester.GET(endpoint);
};

export default {
  list,
};