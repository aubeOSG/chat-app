import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  updatedBy: '',
};

export const config: StateConfig = {
  name: 'lobby',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setUpdatedBy: (state, action) => {
      state.updatedBy = action.payload;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setUpdatedBy,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};