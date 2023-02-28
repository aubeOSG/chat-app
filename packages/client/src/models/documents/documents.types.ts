export type DocumentData = Uint8Array;

export type Document = {
  data?: {
    data: DocumentData;
    type: 'Buffer';
  };
};