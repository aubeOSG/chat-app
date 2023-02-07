import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { users, User, lobby } from '../../models';
import { Avatar } from '../../components';
import { Route as lobbyRoute } from '../lobby/lobby-page';

export const Route = '/users';

export const Content = () => {
  const isJoined = lobby.hooks.useJoined();
  const userListProgress = useRef(false);
  const userList = users.hooks.useUsers();
  const me = users.hooks.useMe();

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
    <div className="users-page">
      <section className="content">
        <header>
          <h2>Chat App</h2>
          <Link className="link" to={lobbyRoute}>
            Back to Lobby
          </Link>
        </header>
        <main className="users-wrapper">
          <section className="content">
            {userList &&
              userList.map((user: User, idx: number) => {
                const classes =
                  me && user.id === me.id ? 'user current-user' : 'user';

                return (
                  <div key={idx} className={classes}>
                    <Avatar alt={user.info.name}>{user.info.avatar.key}</Avatar>
                    <span>{user.info.name}</span>
                  </div>
                );
              })}
          </section>
        </main>
      </section>
    </div>
  );
};

export default {
  Route,
  Content,
};
