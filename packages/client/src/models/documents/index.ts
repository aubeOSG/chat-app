import * as State from './documents-state';
import * as API from './documents-api';
import * as Hooks from './documents-hooks';
import * as YHooks from './y-documents-hooks';

export * from './documents.types';
export const _state = State;
export const api = API;
export const hooks = Hooks;
export const yHooks = YHooks;

export default {
  _state,
  api,
  hooks,
  yHooks,
};