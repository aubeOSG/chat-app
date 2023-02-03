import { useSelector, useDispatch } from 'react-redux';
import IO from 'socket.io-client';
import * as state from '../state';
import * as serviceState from './socketer-state';

const processor: state.StateProcessor = {};

export let io = IO();

export const useProcessor = () => {
  const dispatch = useDispatch();
  
  processor.dispatch = dispatch;
};

export const addEvents = () => {
  io.on('connect', () => {
    console.debug('socket connected', io.id);
    processor.dispatch(serviceState.setIsConnected(true));
  });

  io.on('disconnect', () => {
    console.debug('socket disconnected', io.id);
    processor.dispatch(serviceState.setIsConnected(false));
  });
};

export const cleanupEvents = () => {
  if (!io) {
    console.warn('unable to cleanup socket service: socket not ready');
    return;
  }

  io.off('connect');
  io.off('disconnect');
};

export const useState = () => {
  return useSelector((data: state.RootState) => data[serviceState.config.name]);
};

export const useConnection = () => {
  return useSelector((data: state.RootState) => data[serviceState.config.name].isConnected);
};

export default {
  io,
  useProcessor,
  addEvents,
  cleanupEvents,
  useState,
  useConnection,
};
