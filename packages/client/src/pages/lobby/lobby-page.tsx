import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { users, User, lobby, rooms, Room } from '../../models';
import { Avatar } from '../../components';
import { overlays } from './components';
import { Route as roomRoute } from '../room/room-page';

export const Route = '/lobby';

export const Content = () => {
  const isJoined = lobby.hooks.useJoined();
  const me = users.hooks.useMe();
  const userListProgress = useRef(false);
  const userList = users.hooks.useUsers();
  const roomsProgress = useRef(false);
  const roomList = rooms.hooks.useRooms();
  const [isOpenCreateRoom, setIsOpenCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState<string>('');
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const joinRoom = (room: Room) => {
    console.log('joining room');
  };

  const createRoom = () => {
    setIsOpenCreateRoom(true);
  };

  const closeCreateRoom = (roomName?: string) => {
    setIsOpenCreateRoom(false);

    if (!roomName) {
      return;
    }

    setRoomName(roomName);
  };

  const openInfo = () => {
    setIsOpenInfo(true);
  };

  const closeInfo = () => {
    setIsOpenInfo(false);
  };

  useEffect(() => {
    if (roomName) {
      rooms.api.create(roomName);
    }
  }, [roomName]);

  useEffect(() => {
    const getUsers = () => {
      if (userListProgress.current) {
        return;
      }

      userListProgress.current = true;

      users.api
        .list()
        .then((res) => {
          console.debug('users list', res.data);
          userListProgress.current = false;
          users.hooks.setUsers(res.data.users);
        })
        .catch((e) => {
          userListProgress.current = false;
          console.error('user list error', e);
        });
    };

    const getRooms = () => {
      if (roomsProgress.current) {
        return;
      }

      roomsProgress.current = true;

      rooms.api
        .list()
        .then((res) => {
          console.debug('rooms list', res.data);
          roomsProgress.current = false;
          rooms.hooks.setRooms(res.data.rooms);
        })
        .catch((e) => {
          roomsProgress.current = false;
          console.error('room list error', e);
        });
    };

    getUsers();
    getRooms();
  }, [isJoined]);

  return (
    <div className="lobby-page">
      <section className="content">
        <header>
          <h2>Chat App</h2>

          <button className="btn btn-clear btn-user-info" onClick={openInfo}>
            <span className="logo">OSG</span>
            <Avatar>{me.info.avatar.key}</Avatar>
          </button>
        </header>
        <main className="room-wrapper">
          <section className="sidebar">
            <main className="room-list">
              {roomList &&
                roomList.map((room: Room, idx: number) => {
                  return (
                    <div
                      className="room-link"
                      key={idx}
                      onClick={() => joinRoom(room)}
                    >
                      <Link to={`${roomRoute.replace(':roomId', room.id)}`}>
                        {room.name}
                      </Link>
                    </div>
                  );
                })}
            </main>
            <footer className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={createRoom}>
                Create
              </button>
            </footer>
          </section>
          <section className="content room-view">
            <div>Chat View</div>
          </section>
        </main>
      </section>
      <overlays.CreateRoom
        isOpen={isOpenCreateRoom}
        onClose={closeCreateRoom}
      ></overlays.CreateRoom>
      <overlays.UserInfo
        isOpen={isOpenInfo}
        onClose={closeInfo}
      ></overlays.UserInfo>
    </div>
  );
};

export default {
  Route,
  Content,
};
