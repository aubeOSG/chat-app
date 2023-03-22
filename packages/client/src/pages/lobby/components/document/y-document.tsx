import 'react-quill/dist/quill.snow.css';
import './_document.scss';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import Quill, { Quill as QuillCore, UnprivilegedEditor } from 'react-quill';
import QuillCursors, { Cursor } from 'quill-cursors';
import {
  documents,
  DocumentSelection,
  users,
  avatars,
} from '../../../../models';

QuillCore.register('modules/cursors', QuillCursors);

const Block = QuillCore.import('blots/block');

Block.tagName = 'DIV';
Block.className = 'document-content';

QuillCore.register(Block, true);

export const Editor = () => {
  const documentListProgress = useRef<boolean>(true);
  const ydoc = useRef(new Y.Doc());
  const docSocket = useRef(documents.yHooks.provider(ydoc.current, {}));
  const [editorValue, setEditorValue] = useState('');
  const quillNodeRef = useRef<Quill>(null);
  const quillOpts = {
    theme: 'snow',
    modules: {
      cursors: true,
      history: {
        userOnly: true,
      },
    },
  };

  const loadDoc = (data) => {
    console.log('loading doc', data);
  };

  const getDocs = useCallback(() => {
    if (documentListProgress.current) {
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

        if (doc.data && !doc.data.data) {
          loadDoc(doc.data.data);
        }
      })
      .catch((e) => {
        documentListProgress.current = false;
        console.error('documents list error', e);
      });
  }, []);

  useEffect(() => {
    if (!quillNodeRef.current) {
      return;
    }

    if (!docSocket.current) {
      return;
    }

    const editor = quillNodeRef.current.editor;
    const type = ydoc.current.getText('quill');
    const binding = new QuillBinding(type, editor, docSocket.current.awareness);

    getDocs();
  }, [quillNodeRef]);

  return (
    <section className="document-editor">
      <Quill
        ref={quillNodeRef}
        theme="snow"
        value={editorValue}
        modules={quillOpts.modules}
      ></Quill>
    </section>
  );
};

export default {
  Editor,
};
