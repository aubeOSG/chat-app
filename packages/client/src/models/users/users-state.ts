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
    updateMyInfo: (state, action) => {
      utils.obj.updateObj(state.me.info, action.payload);
    },
    resetMe: (state) => {
      utils.obj.updateObj(state.me, initialState.me);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUserList: (state, action) => {
      const idx = utils.list.indexBy(state.users, 'id', action.payload.id);

      if (idx === -1) {
        console.log('unable to update user list: user not found');
        return;
      }

      state.users.splice(idx, 1, action.payload);
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setMe,
  updateMyInfo,
  resetMe,
  setUsers,
  updateUserList,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};