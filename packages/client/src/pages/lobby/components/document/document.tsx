import 'react-quill/dist/quill.snow.css';
import './_document.scss';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Automerge from '@automerge/automerge';
import Quill from 'react-quill';
import { DocumentEntity } from './document.types';
import { documents, users } from '../../../../models';

export const Document = () => {
  const document = useRef<DocumentEntity>(Automerge.init());
  const activeDoc = documents.hooks.useActiveDoc();
  const me = users.hooks.useMe();
  const documentListProgress = useRef(false);
  const [editorValue, setEditorValue] = useState('');

  const createDoc = useCallback(() => {
    console.debug('creating document');
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

  const loadDoc = useCallback((data) => {
    console.debug('loading document', data);
    document.current = Automerge.load(data);
    setEditorValue(document.current.data[0].text);
  }, []);

  const getDocs = useCallback(() => {
    if (documentListProgress.current || document.current.data) {
      return;
    }

    documentListProgress.current = true;

    documents.api
      .list()
      .then((res) => {
        console.debug('documents received', res.data);
        documentListProgress.current = false;

        const { documents } = res.data;
        const doc = documents[0];

        if (!doc.data || !doc.data.data) {
          createDoc();
        } else {
          loadDoc(doc.data.data);
        }
      })
      .catch((e) => {
        documentListProgress.current = false;
        console.error('documents list error', e);
      });
  }, []);

  const handleUpdate = (val, delta, source) => {
    setEditorValue(val);

    if (source !== 'user' || !document.current.data) {
      return;
    }

    const newDoc = Automerge.change(document.current, (oldDocument) => {
      oldDocument.data[0].text = val;
      console.debug('document updated');
    });
    const saveData = Automerge.save(newDoc);

    document.current = newDoc;
    documents.api.changed(saveData);
    setTimeout(() => {
      // without this timeout, quill will reset the cursor position after typing
      // the first letter of a empty document
      documents.hooks.setActiveDoc(saveData, me.id);
    }, 0);
  };

  useEffect(() => {
    if (activeDoc.userId !== me.id && document.current.data) {
      const binary = new Uint8Array(activeDoc.document);
      const newDoc = Automerge.merge(document.current, Automerge.load(binary));

      console.debug(
        'merging documents',
        activeDoc.userId !== me.id,
        activeDoc.userId,
        me.id
      );
      document.current = newDoc;
      setEditorValue(document.current.data[0].text);
    }
  }, [activeDoc.id, activeDoc.document]);

  useEffect(() => {
    getDocs();
  }, []);

  const quillOpts = {
    modules: {
      clipboard: {
        matchVisual: false,
      },
    },
  };

  return (
    <section className="document-editor">
      <Quill
        theme="snow"
        value={editorValue}
        onChange={handleUpdate}
        modules={quillOpts.modules}
      ></Quill>
    </section>
  );
};

export default {
  Document,
};
