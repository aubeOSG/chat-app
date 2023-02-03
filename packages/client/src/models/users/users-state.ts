import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  users: [],
  me: {
    id: '',
    rooms: [],
    info: {
      name: '',
      avatar: {
        label: '',
        key: '',
      },
    },
  },
};

export const config: StateConfig = {
  name: 'users',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setMe: (state, action) => {
      utils.obj.updateObj(state.me, action.payload);
    },
    resetMe: (state) => {
      utils.obj.updateObj(state.me, initialState.me);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setMe,
  resetMe,
  setUsers,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};