import React from 'react';

export const Route = '/lobby';

export const Content = () => {
  return (
    <>
      <section className="sidebar">Sidebar</section>
      <section className="content">Content</section>
    </>
  );
};

export default {
  Route,
  Content,
};
