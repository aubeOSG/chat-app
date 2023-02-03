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

  socketer.hooks.io.on('lobby-joined', () => {
    processor.dispatch(state.setIsJoined(true));
  });

  socketer.hooks.io.on('lobby-left', () => {
    processor.dispatch(state.setIsJoined(false));
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

export const useJoined = () => {
  return useSelector((data: RootState) => data[state.config.name].isJoined);
};

export default {
  useProcessor,
  addEvents,
  cleanupEvents,
  useState,
  useJoined,
};