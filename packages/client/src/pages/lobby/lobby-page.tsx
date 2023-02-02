import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { users, User, messages, Message } from '../../models';
import { Avatar } from '../../components';

export const Route = '/lobby';
const socket = io();

export const Content = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [me, setMe] = useState<User>();
  const [userList, setUserList] = useState<Array<User>>([]);
  const userListProgress = useRef(false);
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const messageListProgress = useRef(false);
  const [newMessage, setNewMessage] = useState<string>('');

  const sendNewMessage = () => {
    const messageData = {
      message: {
        userId: me?.id,
        content: newMessage,
      },
    };

    console.debug('sending message', messageData);
    socket.emit('message-send', messageData);
    setNewMessage('');
  };

  const updateNewMessage = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = ev.currentTarget.value;

    setNewMessage(val);
  };

  const handleInputNewMessage = (
    ev: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    switch (ev.key) {
      case 'Enter':
        if (ev.ctrlKey || ev.metaKey) {
          return;
        }

        ev.stopPropagation();
        ev.preventDefault();
        sendNewMessage();
        break;
      case 'Escape':
        ev.currentTarget.blur();
        break;
    }
  };

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
          setUserList(res.data.users);
        })
        .catch((e) => {
          userListProgress.current = false;
          console.error('user list error', e);
        });
    };
    const getMessages = () => {
      if (messageListProgress.current) {
        return;
      }

      messageListProgress.current = true;

      messages.api
        .list()
        .then((res) => {
          console.debug('messages received', res.data);
          messageListProgress.current = false;
          setMessageList(res.data.messages);
        })
        .catch((e) => {
          messageListProgress.current = false;
          console.error('user list error', e);
        });
    };

    socket.on('connect', () => {
      console.debug('connected');
      setIsConnected(true);
      getUsers();
      getMessages();
    });

    socket.on('disconnect', () => {
      console.debug('disconnect');
      setIsConnected(false);
    });

    socket.on('lobby-joined', () => {
      console.debug('lobby joined');
      getUsers();
    });

    socket.on('lobby-left', () => {
      console.debug('lobby left');
      getUsers();
    });

    socket.on('user-info', (data) => {
      console.debug('user info');
      setMe(data.user);
    });

    socket.on('message-new', (data) => {
      console.debug('new message', data);
      setMessageList(messageList.concat([data.message]));
    });

    return () => {
      socket.off('connect');
      socket.off('lobby-joined');
      socket.off('lobby-left');
      socket.off('user-info');
    };
  }, [me, messageList]);

  return (
    <>
      <section className="sidebar">
        <header>
          <h2>Users</h2>
        </header>
        <main>
          {userList &&
            userList.map((user: User, idx: number) => {
              const classes =
                me && user.id === me.id ? 'user current-user' : 'user';

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
          <h2>Messages</h2>
        </header>
        <main>
          {messageList &&
            messageList.map((msg: Message, idx: number) => {
              const classes = me && msg.user.id === me.id ? 'current-user' : '';

              return (
                <div className={`message ${classes}`} key={idx}>
                  <div className="message__body">
                    <div className="message__content">{msg.content}</div>
                    <div
                      className="message__user user"
                      data-user-id={msg.user.id}
                    >
                      <Avatar>{msg.user.info.avatar.key}</Avatar>
                      {msg.user.info.name}
                    </div>
                  </div>
                </div>
              );
            })}
        </main>
        <footer>
          <textarea
            value={newMessage}
            onChange={updateNewMessage}
            onKeyDown={handleInputNewMessage}
          ></textarea>
        </footer>
      </section>
    </>
  );
};

export default {
  Route,
  Content,
};
