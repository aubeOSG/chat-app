import { useSelector, useDispatch } from 'react-redux';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import { Room } from './rooms.types';
import * as state from './rooms-state';

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

  socketer.hooks.io.on('room-created', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to set room: processor not ready');
    }

    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('setting active room', req);
    processor.dispatch(state.setActiveRoom(req.data.room));
  });

  socketer.hooks.io.on('room-new', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to add room: processor not ready');
    }

    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('adding new room', req);
    processor.dispatch(state.addRoom(req.data.room));
  });

  socketer.hooks.io.on('room-joined', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to add room: processor not ready');
    }

    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('setting active room', req);
    processor.dispatch(state.setActiveRoom(req.data.room));
  });

  socketer.hooks.io.on('room-member-joined', (req) => {
    console.log('member join', req);
    if (!processor.dispatch) {
      console.warn('unable to add room: processor not ready');
    }

    if (req.error) {
      return;
    }

    console.debug('adding member to room', req);
    processor.dispatch(state.updateRoom(req.data.room));
  });

  socketer.hooks.io.on('room-member-left', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to add room: processor not ready');
    }

    if (req.error) {
      return;
    }

    console.debug('removing member from room', req);
    processor.dispatch(state.updateRoom(req.data.room));
  });
};

export const cleanupEvents = () => {
  if (!socketer.hooks.io) {
    console.warn('unable to clean events: sockets not ready');
    return;
  }

  socketer.hooks.io.off('room-created');
  socketer.hooks.io.off('room-new');
  socketer.hooks.io.off('room-joined');
  socketer.hooks.io.off('room-member-joined');
  socketer.hooks.io.off('room-member-left');
};

export const useState = () => {
  return useSelector((data: RootState) => data[state.config.name]);
};

export const useActiveRoom = (): Room => {
  return useSelector((data: RootState) => data[state.config.name].activeRoom);
};

export const setActiveRoom = (data: Room) => {
  if (!processor.dispatch) {
    console.warn('unable to set active room: processor not set');
    return;
  }

  processor.dispatch(state.setActiveRoom(data));
};

export const useRooms = (): Array<Room> => {
  return useSelector((data: RootState) => data[state.config.name].rooms);
};

export const setRooms = (data: Array<Room>) => {
  if (!processor.dispatch) {
    console.warn('unable to set rooms: processor not set');
    return;
  }

  processor.dispatch(state.setRooms(data));
};

export default {
  useProcessor,
  addEvents,
  cleanupEvents,
  useState,
  useActiveRoom,
  setActiveRoom,
  useRooms,
  setRooms,
};