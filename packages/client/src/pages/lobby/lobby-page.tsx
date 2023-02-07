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
          <h2>Users</h2>
        </header>
        <main>
          {userList &&
            userList.map((user: User, idx: number) => {
              const classes =
                me && user.id === me.id ? 'user current-user' : 'user';
              console.log('user list', user);
              return (
                <div key={idx} className={classes}>
                  <Avatar>{user.info.avatar.key}</Avatar>
                  {user.info.name}
                </div>
              );
            })}
        </main>
      </section>
      <section className="content">
        <header>
          <h2>Rooms</h2>

          <button className="btn btn-primary" onClick={createRoom}>
            Create
          </button>
        </header>
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
      </section>
      <overlays.CreateRoom
        isOpen={isOpenCreateRoom}
        onClose={closeCreateRoom}
      ></overlays.CreateRoom>
    </div>
  );
};

export default {
  Route,
  Content,
};
