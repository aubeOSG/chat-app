import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { pages } from '../pages';

export const AppRoutes = () => {
  const pageNames = Object.keys(pages);

  return (
    <Routes>
      {pageNames.map((name: string, idx: number) => {
        const page = pages[name].page;

        return <Route key={idx} path={page.Route} element={<page.Content />} />;
      })}
      <Route
        path="*"
        element={<Navigate to={pages.lobby.page.Route} />}
      ></Route>
    </Routes>
  );
};

export const Root = () => {
  return (
    <BrowserRouter basename="/app">
      <section className="wrapper">
        <main className="container">
          <AppRoutes />
        </main>
      </section>
    </BrowserRouter>
  );
};

export default {
  AppRoutes,
  Root,
};
