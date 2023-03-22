import { useSelector, useDispatch } from 'react-redux';
import { ProviderConfiguration, MessageHandler, ReqDocumentUpdated } from './documents.types';
import {
  StateProcessor,
  RootState,
  socketer
} from '../../services';
import { Doc } from 'yjs';
import { Socket } from 'socket.io-client';
import * as state from './documents-state';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { Observable } from 'lib0/observable';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth';
import * as awarenessProtocol from 'y-protocols/awareness';

const processor: StateProcessor = {};
export const messageSync = 0;
export const messageAwareness = 1;
export const messageAuth = 2;
export const messageQueryAwareness = 3;

const messageHandlers: Array<MessageHandler> = [];

messageHandlers[messageSync] = (encoder, decoder, provider: SocketProvider, emitSynced, _messageType) => {
  encoding.writeVarUint(encoder, messageSync);

  const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, provider.doc, provider);

  if (emitSynced && syncMessageType === syncProtocol.messageYjsSyncStep2 && !provider.synced) {
    provider.synced = true;
  }
};

messageHandlers[messageAwareness] = (encoder, _decoder, provider: SocketProvider, _emitSynced, _messageType) => {
  encoding.writeVarUint(encoder, messageAwareness)
  encoding.writeVarUint8Array(
    encoder,
    awarenessProtocol.encodeAwarenessUpdate(
      provider.awareness,
      Array.from(provider.awareness.getStates().keys())
    )
  )
};

messageHandlers[messageAuth] = (_encoder, decoder, provider: SocketProvider, _emitSynced, _messageType) => {
  awarenessProtocol.applyAwarenessUpdate(
    provider.awareness,
    decoding.readVarUint8Array(decoder),
    provider
  )
};

messageHandlers[messageQueryAwareness] = (_encoder, decoder, provider: SocketProvider, _emitSynced, _messageType) => {
  authProtocol.readAuthMessage(
    decoder,
    provider.doc,
    (_ydoc, reason) => {
      console.warn(`Permission denied to access.\n${reason}`)
    }
  )
};

const readMessage = (provider, buf: Uint8Array, emitSynced: boolean) => {
  const decoder = decoding.createDecoder(buf);
  const encoder = encoding.createEncoder();
  const messageType = decoding.readVarUint(decoder);
  const messageHandler = provider.messageHandlers[messageType];
  
  if (!messageHandler) {
    console.error('Unable to read message', messageType);
  } else {
    messageHandler(encoder, decoder, provider, emitSynced, messageType);
  }

  return encoder;
};

export const useProcessor = () => {
  const dispatch = useDispatch();

  processor.dispatch = dispatch;
};

class SocketProvider extends Observable<string> {
  public IO: Socket;
  public doc: Doc;
  public awareness: awarenessProtocol.Awareness;
  public messageHandlers: Array<MessageHandler>;
  private _handleUpdate: (update: any, origin: any) => void;
  private _handleAwarenessUpdate: ({ added, updated, removed }: { added: any; updated: any; removed: any; }, _origin: any) => void;
  private _handleUnload: () => void;
  private _synced: boolean;

  constructor (io: Socket, doc: Doc, {
    awareness = new awarenessProtocol.Awareness(doc),
  }: ProviderConfiguration) {
    super();

    this.IO = io;
    this.doc = doc;
    this.awareness = awareness;
    this.messageHandlers = messageHandlers.slice();
    this._synced = false;

    this._handleUpdate = (update, origin) => {
      console.log('socket provider - event: update');
      if (origin === this) {
        return;
      }
      
      const encoder = encoding.createEncoder();

      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      this.changed(encoding.toUint8Array(encoder));
    };
    this.doc.on('update', this._handleUpdate);

    this._handleAwarenessUpdate = ({ added, updated, removed }, _origin) => {
      console.log('socket provider - event: awareness update', added, updated, removed, _origin);
      const changedClients = added.concat(updated).concat(removed)
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
      );
      
      this.changed(encoding.toUint8Array(encoder));
    }
    awareness.on('update', this._handleAwarenessUpdate);

    this._handleUnload = () => {
      awarenessProtocol.removeAwarenessStates(this.awareness, [doc.clientID], 'window unload');
    };
    window.addEventListener('unload', this._handleUnload);

    this.addEvents();
  }
  get synced () {
    return this._synced;
  }
  set synced (state) {
    if (this._synced !== state) {
      this._synced = state;
      this.emit('synced', [state]);
      this.emit('sync', [state]);
    }
  }
  addEvents() {
    if (!processor.dispatch) {
      console.warn('unable to add events: processor not ready');
    }
  
    if (!socketer.hooks.io) {
      console.warn('unable to add events: sockets not ready');
      return;
    }

    socketer.hooks.io.on('document-updated', (req: ReqDocumentUpdated) => {
      if (!processor.dispatch) {
        console.warn('unable to update document: processor not ready');
      }
  
      if (req.error) {
        console.error(req.message);
        return;
      }

      if (req.data.id === this.doc.clientID) {
        return;
      }

      readMessage(this, new Uint8Array(req.data.document), true);
    });
  }
  cleanupEvents() {
    if (!socketer.hooks.io) {
      console.warn('unable to clean events: sockets not ready');
      return;
    }

    socketer.hooks.io.off('document-changed');
  }
  changed(data: Uint8Array) {
    console.log('sending change', data);
    this.IO.emit('document-changed', {
      buffer: data.buffer,
      id: this.doc.clientID,
    });
  }
  destroy () {
    this.disconnect();
    window.removeEventListener('unload', this._handleUnload);
    this.awareness.off('update', this._handleAwarenessUpdate);
    this.doc.off('update', this._handleUpdate);
    this.cleanupEvents();
    super.destroy();
  }
  disconnect () {
    console.log('socket provider disconnect')
  }
  connect () {
    console.log('socket provider connect');
  }
}

export const provider = (doc: Doc, options) => {
  if (!processor.dispatch) {
    console.warn('unable to add events: processor not ready');
    return;
  }

  if (!socketer.hooks.io) {
    console.warn('unable to add events: sockets not ready');
    return;
  }

  return new SocketProvider(socketer.hooks.io, doc, options);
};

export default {
  messageSync,
  messageQueryAwareness,
  messageAwareness,
  messageAuth,
  useProcessor,
  provider,
};

