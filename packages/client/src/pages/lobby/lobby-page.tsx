import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { users, User } from '../../models';

export const Route = '/lobby';
const socket = io(`http://${window.location.hostname}:3000`);

export const Content = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPing, setLastPing] = useState('');
  const [userList, setUserList] = useState<Array<User>>([]);
  const userListProgress = useRef(false);

  useEffect(() => {
    const getUsers = () => {
      if (userListProgress.current) {
        return;
      }

      userListProgress.current = true;

      users.api
        .list()
        .then((res) => {
          userListProgress.current = false;
          setUserList(res.data.users);
        })
        .catch((e) => {
          userListProgress.current = false;
          console.error('user list error', e);
        });
    };

    socket.on('connect', () => {
      setIsConnected(true);
      getUsers();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('ping', () => {
      setLastPing(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('ping');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  };

  return (
    <>
      <section className="sidebar">Sidebar</section>
      <section className="content">
        <p>Connected: {`${isConnected}`}</p>
        <p>Last Ping: {lastPing || '-'}</p>
        <button onClick={sendPing}>Send Ping</button>
      </section>
    </>
  );
};

export default {
  Route,
  Content,
};
