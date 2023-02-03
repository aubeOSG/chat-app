import { useSelector, useDispatch } from 'react-redux';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import { User } from './users.types';
import * as state from './users-state';

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

  socketer.hooks.io.on('user-info', (data) => {
    if (!processor.dispatch) {
      console.warn('unable to set user: processor not ready');
    }

    console.debug('setting user', data);
    processor.dispatch(state.setMe(data.user));
  });
};

export const cleanupEvents = () => {
  if (!socketer.hooks.io) {
    console.warn('unable to clean events: sockets not ready');
    return;
  }

  socketer.hooks.io.off('user-info');
};

export const useState = () => {
  return useSelector((data: RootState) => data[state.config.name]);
};

export const useMe = (): User => {
  return useSelector((data: RootState) => data[state.config.name].me);
};

export const useUsers = (): Array<User> => {
  return useSelector((data: RootState) => data[state.config.name].users);
};

export const setUsers = (data: Array<User>) => {
  if (!processor.dispatch) {
    console.warn('unable to set users: processor not set');
    return;
  }

  processor.dispatch(state.setUsers(data));
};

export default {
  useProcessor,
  addEvents,
  cleanupEvents,
  useState,
  useMe,
  useUsers,
};