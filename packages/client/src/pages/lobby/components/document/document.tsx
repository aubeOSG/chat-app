import 'react-quill/dist/quill.snow.css';
import './_document.scss';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Automerge from '@automerge/automerge';
import Quill from 'react-quill';
import { DocumentEntity } from './document.types';

export const Document = () => {
  const document = useRef<DocumentEntity>(Automerge.init());
  const [editorValue, setEditorValue] = useState('');

  const createDoc = useCallback(() => {
    document.current = Automerge.change(
      document.current,
      (doc: DocumentEntity) => {
        doc.data = [];
        doc.data.push({
          text: editorValue,
        });
      }
    );
  }, []);

  useEffect(() => {
    if (document.current.data) {
      document.current.data[0].text = editorValue;
    }
  }, [editorValue]);

  useEffect(() => {
    if (!document.current.data) {
      createDoc();
    }
  }, []);

  return (
    <section className="document-editor">
      <Quill theme="snow" value={editorValue} onChange={setEditorValue}></Quill>
    </section>
  );
};

export default {
  Document,
};
