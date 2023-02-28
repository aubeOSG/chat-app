import { createSlice } from '@reduxjs/toolkit';
import utils from '../../utils';
import { StateConfig } from '../../services';

export const initialState = {
  documents: [],
  activeDoc: {
    userId: '',
    document: new Uint8Array(),
  },
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
    setActiveDoc: (state, action) => {
      if (state.activeDoc.document.byteLength !== action.payload.document.byteLength) {
        console.debug('setting active doc', action.payload);
        state.activeDoc = action.payload;
      }
    },
    resetActiveDoc: (state, action) => {
      state.activeDoc = initialState.activeDoc;
    },
  },
};

export const slice = createSlice(config);

export const {
  setState,
  setDocuments,
  addDocument,
  resetDocuments,
  setActiveDoc,
  resetActiveDoc,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  initialState,
  config,
  slice,
  reducer,
};