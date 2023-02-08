import React, { useState, useEffect, useRef } from 'react';
import { users, User, messages, Message, rooms } from '../../../../models';
import { Avatar, Icon } from '../../../../components';

export const Room = () => {
  const me = users.hooks.useMe();
  const allUsers = users.hooks.useUsers();
  const room = rooms.hooks.useActiveRoom();
  const messageList = messages.hooks.useMessages();
  const messageListProgress = useRef(false);
  const [newMessage, setNewMessage] = useState<string>('');

  const leaveRoom = () => {
    if (room.id) {
      rooms.api.leave(room, me);
      rooms.hooks.resetActiveRoom();
    }
  };

  const sendNewMessage = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    const messageData = {
      roomId: room.id,
      user: me,
      content: newMessage,
    };

    console.debug('sending message', messageData);
    messages.api.send(messageData);
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

        sendNewMessage(ev);
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
          messages.hooks.setMessages(res.data.messages);
        })
        .catch((e) => {
          messageListProgress.current = false;
          console.error('user list error', e);
        });
    };

    if (room.id) {
      getMessages();
    }
  }, [room.id]);

  if (!room.id) {
    return <div></div>;
  }

  return (
    <section className="chatroom">
      {!room.isDefault && (
        <header className="d-flex">
          <button
            type="button"
            className="btn btn-primary rounded"
            title="Leave Room"
            onClick={leaveRoom}
          >
            <Icon symbol="call_missed_outgoing" />
          </button>
        </header>
      )}
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
      <footer className="message-box">
        <form onSubmit={sendNewMessage}>
          <textarea
            value={newMessage}
            onChange={updateNewMessage}
            onKeyDown={handleInputNewMessage}
          ></textarea>
          <button
            type="submit"
            className="btn btn-success"
            title="Send Message"
          >
            <Icon symbol="send"></Icon>
          </button>
        </form>
      </footer>
    </section>
  );
};

export default {
  Room,
};
