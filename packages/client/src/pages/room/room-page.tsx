import React, { useState, useEffect, useRef } from 'react';
import { socketer } from '../../services';
import { users, User, messages, Message } from '../../models';
import { Avatar } from '../../components';

export const Route = '/room/:roomId';

export const Content = () => {
  const me = users.hooks.useMe();
  const userList = users.hooks.useUsers();
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
    socketer.hooks.io.emit('message-send', messageData);
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

    socketer.hooks.io.on('message-new', (data) => {
      console.debug('new message', data);
      setMessageList(messageList.concat([data.message]));
    });
  }, [messageList]);

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
