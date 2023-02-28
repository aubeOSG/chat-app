import React, { useState, useEffect } from 'react';
import { RoomLinkProps } from './room-link.types';
import { users, User, rooms, Room } from '../../../../models';
import { Avatar } from '../../../../components';

export const RoomLink = ({ className, room, ...props }: RoomLinkProps) => {
  let classes = `room-link ${className || ''}`;
  const me = users.hooks.useMe();
  const allUsers = users.hooks.useUsers();
  const [userList, setUserList] = useState<Array<User>>(
    allUsers.filter((user: User) => {
      return room.userIds.indexOf(user.id) !== -1;
    })
  );
  const activeRoom = rooms.hooks.useActiveRoom();

  const joinRoom = (room: Room) => {
    rooms.api.join(room, me);
  };

  if (activeRoom.id && activeRoom.id === room.id) {
    classes += ' current-room';
  }

  useEffect(() => {
    setUserList(
      allUsers.filter((user: User) => {
        return room.userIds.indexOf(user.id) !== -1;
      })
    );
  }, [room.userIds.length, allUsers.length]);

  return (
    <div className={classes} onClick={() => joinRoom(room)}>
      <div>{room.name}</div>
      <div className="user-list">
        {userList &&
          userList.map((user: User, idx: number) => {
            return (
              <Avatar key={idx} alt={user.info.name}>
                {user.info.avatar.key}
              </Avatar>
            );
          })}
      </div>
    </div>
  );
};

export default {
  RoomLink,
};
