export * from './document.types';
import * as component from './document';
import * as yComponent from './y-document';

export const Document = component.Document;
export const Editor = yComponent.Editor;

export default {
  Document,
  Editor,
};