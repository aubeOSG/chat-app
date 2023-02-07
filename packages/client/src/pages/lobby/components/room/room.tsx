import React, { useState, useEffect, useRef } from 'react';
import { socketer } from '../../../../services';
import { users, User, messages, Message, rooms } from '../../../../models';
import { Avatar } from '../../../../components';

export const Room = () => {
  const me = users.hooks.useMe();
  const allUsers = users.hooks.useUsers();
  const room = rooms.hooks.useActiveRoom();
  const [userList, setUserList] = useState<Array<User>>([]);
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
        .list(room.id)
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
  }, [room.id]);

  useEffect(() => {
    if (!room.id) {
      return;
    }

    console.log('room', room);
    console.log('allUsers', allUsers);

    setUserList(
      allUsers.filter((user: User) => {
        return room.userIds.indexOf(user.id) !== -1;
      })
    );
  }, [room, allUsers]);

  if (!room.id) {
    return <div></div>;
  }

  return (
    <section className="chatroom">
      <header className="d-flex">
        {userList &&
          userList.map((user: User, idx: number) => {
            const classes =
              me && user.id === me.id ? 'user current-user' : 'user';

            return (
              <div key={idx} className={classes}>
                <Avatar alt={user.info.name}>{user.info.avatar.key}</Avatar>
              </div>
            );
          })}
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
  );
};

export default {
  Room,
};
