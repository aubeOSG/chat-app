import 'react-quill/dist/quill.snow.css';
import './_document.scss';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Automerge from '@automerge/automerge';
import Quill, { Quill as QuillCore } from 'react-quill';
import QuillCursors, { Cursor } from 'quill-cursors';
import { DocumentEntity } from './document.types';
import {
  documents,
  DocumentSelection,
  users,
  avatars,
} from '../../../../models';

QuillCore.register('modules/cursors', QuillCursors);

export const Document = () => {
  const document = useRef<DocumentEntity>(Automerge.init());
  const activeDoc = documents.hooks.useActiveDoc();
  const me = users.hooks.useMe();
  const documentListProgress = useRef(false);
  const [editorValue, setEditorValue] = useState('');
  const quillNodeRef = useRef<Quill>(null);
  const activeUsers: { [key: string]: DocumentSelection } =
    documents.hooks.useActiveSelection();
  const quillOpts = {
    modules: {
      clipboard: {
        matchVisual: false,
      },
      cursors: true,
    },
  };

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

  const handleSelection = (range, source, editor) => {
    const isUserSelection = source === 'user';
    const isUserChange = source === 'silent' && range.index > 0;

    if (!isUserSelection && !isUserChange) {
      return;
    }

    if (range === null) {
      range = {
        index: -1,
        length: -1,
      };
    }

    documents.api.selection({
      user: me,
      range,
    });
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

  useEffect(() => {
    if (!quillNodeRef.current) {
      return;
    }

    const editor = quillNodeRef.current.editor;

    if (!editor) {
      return;
    }

    const activeUserList = Object.keys(activeUsers);

    if (!activeUserList || !activeUserList.length) {
      return;
    }

    const cursors = editor.getModule('cursors');
    let selection;
    let cursor: Cursor;

    for (let i = 0; i < activeUserList.length; i++) {
      if (activeUsers[activeUserList[i]].user.id === me.id) {
        continue;
      }

      selection = activeUsers[activeUserList[i]];

      if (selection.range.index === -1) {
        cursors.removeCursor(selection.user.id);
      } else {
        const cursorClr = avatars.api.getColor(selection.user.info.avatar.key);

        cursor = cursors.createCursor(
          selection.user.id,
          selection.user.info.name,
          cursorClr
        );
        cursors.moveCursor(selection.user.id, selection.range);
      }
    }
  }, [quillNodeRef, activeUsers]);

  return (
    <section className="document-editor">
      <Quill
        ref={quillNodeRef}
        theme="snow"
        value={editorValue}
        onChange={handleUpdate}
        onChangeSelection={handleSelection}
        modules={quillOpts.modules}
      ></Quill>
    </section>
  );
};

export default {
  Document,
};
