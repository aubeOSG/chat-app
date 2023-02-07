import React, { useState, useEffect, useRef } from 'react';
import { users, lobby, rooms, Room } from '../../models';
import { Avatar } from '../../components';
import components from './components';

export const Route = '/lobby';

export const Content = () => {
  const isJoined = lobby.hooks.useJoined();
  const me = users.hooks.useMe();
  const activeRoom = rooms.hooks.useActiveRoom();
  const userListProgress = useRef(false);
  const roomsProgress = useRef(false);
  const roomList = rooms.hooks.useRooms();
  const [isOpenCreateRoom, setIsOpenCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState<string>('');
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const leaveRoom = () => {
    if (activeRoom.id) {
      rooms.api.leave(activeRoom, me);
    }
  };

  const joinRoom = (room: Room) => {
    leaveRoom();
    rooms.api.join(room, me);
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
      leaveRoom();
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
                  let classes = 'room-link';

                  if (activeRoom.id && activeRoom.id === room.id) {
                    classes += ' current-room';
                  }

                  return (
                    <div
                      className={classes}
                      key={idx}
                      onClick={() => joinRoom(room)}
                    >
                      {room.name}
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
            <components.Room></components.Room>
          </section>
        </main>
      </section>
      <components.overlays.CreateRoom
        isOpen={isOpenCreateRoom}
        onClose={closeCreateRoom}
      ></components.overlays.CreateRoom>
      <components.overlays.UserInfo
        isOpen={isOpenInfo}
        onClose={closeInfo}
      ></components.overlays.UserInfo>
    </div>
  );
};

export default {
  Route,
  Content,
};
