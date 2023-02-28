import { useSelector, useDispatch } from 'react-redux';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import * as state from './lobby-state';

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

  socketer.hooks.io.on('lobby-joined', (req) => {
    console.debug('lobby joined', req);
    setTimeout(() => {
      processor.dispatch(state.setUpdatedBy(req.data.user.id));
    }, 150);
  });

  socketer.hooks.io.on('lobby-left', (req) => {
    console.debug('lobby left', req);
    setTimeout(() => {
      processor.dispatch(state.setUpdatedBy(req.data.user.id));
    }, 150);
  });
};

export const cleanupEvents = () => {
  if (!socketer.hooks.io) {
    console.warn('unable to clean events: sockets not ready');
    return;
  }

  socketer.hooks.io.off('lobby-joined');
  socketer.hooks.io.off('lobby-left');
};

export const useState = () => {
  return useSelector((data: RootState) => data[state.config.name]);
};

export const useUpdatedBy = () => {
  return useSelector((data: RootState) => data[state.config.name].updatedBy);
};

export default {
  useProcessor,
  addEvents,
  cleanupEvents,
  useState,
  useUpdatedBy,
};