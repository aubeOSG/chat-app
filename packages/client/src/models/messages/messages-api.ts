import { AxiosPromise } from "axios";
import { Message, NewMessage } from './messages.types';
import { requester, socketer } from '../../services';

export const endpoint = '/messages';

export const list = (roomId: string): AxiosPromise<{ messages: Array<Message> }> => {
  return requester.GET(endpoint, { roomId });
};

export const send = (message: NewMessage) => {
  if (!socketer.hooks.io) {
    console.warn('unable to send message: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('message-send', { message });
};

export default {
  list,
  send,
};