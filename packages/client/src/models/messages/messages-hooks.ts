import { useSelector, useDispatch } from 'react-redux';
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

export default {
 useProcessor,
 addEvents,
 cleanupEvents,
 useState,
 useMessages,
};