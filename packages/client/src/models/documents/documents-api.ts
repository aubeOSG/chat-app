import { AxiosPromise } from "axios";
import { Document, DocumentData, DocumentSelection } from './documents.types';
import { requester, socketer } from '../../services';

export const endpoint = '/documents';

export const list = (): AxiosPromise<{ documents: Array<Document> }> => {
  return requester.GET(endpoint);
};

export const changed = (data: DocumentData) => {
  if (!socketer.hooks.io) {
    console.warn('unable to send message: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('document-changed', data);
};

export const selection = (data: DocumentSelection) => {
  if (!socketer.hooks.io) {
    console.warn('unable to send message: sockets not ready');
    return;
  }

  socketer.hooks.io.emit('document-selection', data);
};

export default {
  list,
  changed,
  selection,
};