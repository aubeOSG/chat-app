import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  rooms: [],
  activeRoom: {},
};

export const config: StateConfig = {
  name: 'rooms',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action) => {
      const idx = utils.list.indexBy(state.rooms, 'id', action.payload.id);

      if (idx === -1) {
        console.error('unable to update room: room not found', action);
        return;
      }

      state.rooms.splice(idx, 1, action.payload);

      if (state.activeRoom.id === action.payload.id) {
        utils.obj.updateObj(state.activeRoom, action.payload);
      }
    },
    removeRoom: (state, action) => {
      const idx = utils.list.indexBy(state.rooms, 'id', action.payload.id);

      if (idx === -1) {
        console.error('unable to remove room: room not found');
        return;
      }

      state.rooms.splice(idx, 1);
    },
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
    },
    resetActiveRoom: (state) => {
      state.activeRoom = {};
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setRooms,
  addRoom,
  updateRoom,
  removeRoom,
  setActiveRoom,
  resetActiveRoom,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};