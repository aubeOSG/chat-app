import { User } from '../users/users.types';
import * as Y from 'yjs';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as AwarenessProtocol from 'y-protocols/awareness';

export type DocumentData = Uint8Array;

export type Document = {
  data?: {
    data: DocumentData;
    type: 'Buffer';
  };
};

export type DocumentSelection = {
  range: {
    index: number;
    length: number;
  };
  user: User;
};

export interface ProviderConfiguration {
  awareness?: AwarenessProtocol.Awareness;
}

export type ReqDocumentUpdated = {
  data: {
    id: number;
    userId: string;
    document: ArrayBuffer;
  };
  error?: boolean;
  message?: string;
};

export type MessageHandler = (
  encoder: encoding.Encoder,
  decoder: decoding.Decoder,
  provider,
  emitSynced: boolean,
  messageType: number
) => void;