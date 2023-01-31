import { AxiosPromise } from "axios";
import { Message } from './messages.types';
import { requester } from '../../services';

export const endpoint = '/messages';

export const list = (): AxiosPromise<{ messages: Array<Message> }> => {
  return requester.GET(endpoint);
};

export default {
  list,
};