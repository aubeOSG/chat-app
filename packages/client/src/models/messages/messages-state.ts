import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  messages: [],
};

export const config: StateConfig = {
  name: 'messages',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetMessages: (state, action) => {
      state.messages = initialState.messages;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setMessages,
  addMessage,
  resetMessages,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};