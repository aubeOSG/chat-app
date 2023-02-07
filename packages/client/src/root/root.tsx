import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { pages } from '../pages';
import { socketer } from '../services';
import { lobby, users, rooms } from '../models';

export const AppRoutes = () => {
  const navigate = useNavigate();
  const pageNames = Object.keys(pages);
  const activeRoom = rooms.hooks.useActiveRoom();

  useEffect(() => {
    console.log('activeRoom', activeRoom);
    if (activeRoom.id) {
      navigate(`${pages.room.page.Route.replace(':roomId', activeRoom.id)}`);
    } else {
      navigate(pages.lobby.page.Route);
    }
  }, [activeRoom.id]);

  console.log('activeRoom', activeRoom);

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
  socketer.hooks.useProcessor();
  users.hooks.useProcessor();
  lobby.hooks.useProcessor();
  rooms.hooks.useProcessor();

  const isConnected = socketer.hooks.useConnection();

  useEffect(() => {
    lobby.hooks.addEvents();
    users.hooks.addEvents();
    rooms.hooks.addEvents();
    socketer.hooks.addEvents();

    return () => {
      socketer.hooks.cleanupEvents();
      lobby.hooks.cleanupEvents();
      users.hooks.cleanupEvents();
      rooms.hooks.cleanupEvents();
    };
  }, []);

  if (!isConnected) {
    return <section className="wrapper"></section>;
  }

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
