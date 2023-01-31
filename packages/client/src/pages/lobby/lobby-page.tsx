import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { users, User, messages, Message } from '../../models';

export const Route = '/lobby';
const socket = io(`http://${window.location.hostname}:3000`);

export const Content = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [me, setMe] = useState<User>();
  const [userList, setUserList] = useState<Array<User>>([]);
  const userListProgress = useRef(false);
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const messageListProgress = useRef(false);
  const [newMessage, setNewMessage] = useState<string>('');

  const sendNewMessage = () => {
    socket.emit('message-send', {
      message: {
        userId: me?.id,
        content: newMessage,
      },
    });
    setNewMessage('');
  };

  const updateNewMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.currentTarget.value;

    setNewMessage(val);
  };

  const handleInputNewMessage = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    switch (ev.key) {
      case 'Enter':
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
          messageListProgress.current = false;
          setMessageList(res.data.messages);
        })
        .catch((e) => {
          messageListProgress.current = false;
          console.error('user list error', e);
        });
    };

    socket.on('connect', () => {
      setIsConnected(true);
      getUsers();
      getMessages();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('lobby-joined', () => {
      getUsers();
    });

    socket.on('lobby-left', () => {
      getUsers();
    });

    socket.on('user-info', (data) => {
      setMe(data.user);
    });

    socket.on('message-new', (data) => {
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
              const classes = me && user.id === me.id ? 'current-user' : '';

              return (
                <div key={idx} className={classes}>
                  {user.name}
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
              return (
                <div key={idx}>
                  <div>{msg.content}</div>
                  <div data-user-id={msg.userId}>{msg.userName}</div>
                </div>
              );
            })}
        </main>
        <footer>
          <input
            type="text"
            value={newMessage}
            onChange={updateNewMessage}
            onKeyDown={handleInputNewMessage}
          />
        </footer>
      </section>
    </>
  );
};

export default {
  Route,
  Content,
};
