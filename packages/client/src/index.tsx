import './index.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(
  <section className="wrapper">
    <main className="container">
      <article>
        <h1>Chat App 1.0</h1>
        <p>Hello World</p>
      </article>
    </main>
  </section>
);
