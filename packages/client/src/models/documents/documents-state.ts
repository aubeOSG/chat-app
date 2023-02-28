import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  documents: [],
};

export const config: StateConfig = {
  name: 'documents',
  initialState,
  reducers: {
    setState: (state, action) => {
      utils.obj.updateObj(state, action.payload);
    },
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    addDocument: (state, action) => {
      state.documents.splice(0, 1, action.payload);
    },
    resetDocuments: (state, action) => {
      state.documents = initialState.documents;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setDocuments,
  addDocument,
  resetDocuments,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};