import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  isJoined: false,
};

export const config: StateConfig = {
  name: 'lobby',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setIsJoined: (state, action) => {
      state.isJoined = action.payload;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setIsJoined,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};