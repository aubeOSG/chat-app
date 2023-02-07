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