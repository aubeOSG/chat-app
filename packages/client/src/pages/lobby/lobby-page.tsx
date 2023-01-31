import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const Route = '/lobby';
const socket = io(`http://${window.location.hostname}:3000`);

export const Content = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPing, setLastPing] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
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
