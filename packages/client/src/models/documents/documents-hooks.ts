import { useSelector, useDispatch } from 'react-redux';
import { DocumentData } from './documents.types';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import * as state from './documents-state';

const processor: StateProcessor = {};

export const useProcessor = () => {
  const dispatch = useDispatch();

  processor.dispatch = dispatch;
};

export const addEvents = () => {
  if (!processor.dispatch) {
    console.warn('unable to add events: processor not ready');
  }

  if (!socketer.hooks.io) {
    console.warn('unable to add events: sockets not ready');
    return;
  }

  socketer.hooks.io.on('document-updated', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to update document: processor not ready');
    }

    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('document changed', req);
    processor.dispatch(state.setActiveDoc(req.data));
  });

  socketer.hooks.io.on('document-selected', (req) => {
    if (!processor.dispatch) {
      console.warn('unable to update document: processor not ready');
    }

    if (req.error) {
      console.error(req.message);
      return;
    }

    console.debug('document selected', req);
    processor.dispatch(state.setActiveSelection(req));
  });
};

export const cleanupEvents = () => {
  if (!socketer.hooks.io) {
    console.warn('unable to clean events: sockets not ready');
    return;
  }

  socketer.hooks.io.off('document-changed');
  socketer.hooks.io.off('document-selected');
};

export const useState = () => {
  return useSelector((data: RootState) => data[state.config.name]);
};

export const useDocuments = () => {
  return useSelector((data: RootState) => data[state.config.name].documents);
};

export const setDocuments = (data: Array<DocumentData>) => {
  if (!processor.dispatch) {
    console.warn('unable to set messages: processor not ready');
  }

  processor.dispatch(state.setDocuments(data));
};

export const useActiveDoc = () => {
  return useSelector((data: RootState) => data[state.config.name].activeDoc);
};

export const setActiveDoc = (document: DocumentData, userId: string) => {
  if (!processor.dispatch) {
    console.warn('unable to set messages: processor not ready');
  }

  processor.dispatch(state.setActiveDoc({
    userId,
    document,
  }));
};

export const useActiveSelection = () => {
  return useSelector((data: RootState) => data[state.config.name].activeSelection);
};

export default {
 useProcessor,
 addEvents,
 cleanupEvents,
 useState,
 useDocuments,
 setDocuments,
 useActiveDoc,
 setActiveDoc,
 useActiveSelection,
};