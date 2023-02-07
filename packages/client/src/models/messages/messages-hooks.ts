import { useSelector, useDispatch } from 'react-redux';
import { Message } from './messages.types';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import * as state from './messages-state';

const processor: StateProcessor = {};

export const useProcessor = () => {
  const dispatch = useDispatch();

  processor.dispatch = dispatch;
};

export const addEvents = () => {
  if (!processor.dispatch) {
    console.warn('unable to add events: processor not ready');
  }

  if (!socketer.hooks.io) {
    console.warn('unable to add events: sockets not ready');
    return;
  }

  socketer.hooks.io.on('message-new', (req) => {
    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('new message', req);
    processor.dispatch(state.addMessage(req.data.message));
  });
};

export const cleanupEvents = () => {
  if (!socketer.hooks.io) {
    console.warn('unable to clean events: sockets not ready');
    return;
  }

  socketer.hooks.io.off('message-new');
};

export const useState = () => {
  return useSelector((data: RootState) => data[state.config.name]);
};

export const useMessages = () => {
  return useSelector((data: RootState) => data[state.config.name].messages);
};

export const setMessages = (data: Array<Message>) => {
  if (!processor.dispatch) {
    console.warn('unable to set messages: processor not ready');
  }

  processor.dispatch(state.setMessages(data));
};

export default {
 useProcessor,
 addEvents,
 cleanupEvents,
 useState,
 useMessages,
 setMessages,
};