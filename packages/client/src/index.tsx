import './index.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Root } from './root';
import { state } from './services';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);
const store = state.init();

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
