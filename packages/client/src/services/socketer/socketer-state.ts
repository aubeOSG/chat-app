import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import * as state from '../state';

export const initialState = {
  isConnected: false,
};

export const config: state.StateConfig = {
  name: 'socketer',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setIsConnected,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};
