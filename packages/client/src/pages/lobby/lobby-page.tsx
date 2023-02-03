import React, { useEffect, useRef } from 'react';
import { users, User, lobby } from '../../models';
import { Avatar } from '../../components';

export const Route = '/lobby';

export const Content = () => {
  const isJoined = lobby.hooks.useJoined();
  const me = users.hooks.useMe();
  const userListProgress = useRef(false);
  const userList = users.hooks.useUsers();

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

    getUsers();
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
        </header>
        <main>Room List</main>
      </section>
    </div>
  );
};

export default {
  Route,
  Content,
};
