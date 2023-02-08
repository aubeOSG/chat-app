import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Avatar, Modal } from '../../../../../components';
import { users } from '../../../../../models';

const UserInfoElement = ({ isOpen, onClose, ...props }, ref) => {
  const title = 'User Info';
  const me = users.hooks.useMe();
  const [userName, setUserName] = useState<string>(me.info.name);
  const isDirty = useRef(false);

  const handleNameChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const val = ev.currentTarget.value;

    isDirty.current = true;
    setUserName(val);
  };

  const handleUserInfo = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!userName) {
      return;
    }

    users.hooks.setMe({ name: userName });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setUserName(me.info.name);
      isDirty.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && isDirty.current) {
      users.api.update(me);
    }
  }, [isOpen, isDirty.current]);

  return (
    <div ref={ref}>
      <Modal
        className="modal-user-info"
        title={title}
        isOpen={isOpen}
        onClose={onClose}
      >
        <form onSubmit={handleUserInfo} name="user-info">
          <main className="overlay-user-info">
            <Avatar className="display">{me.info.avatar.key}</Avatar>

            <label htmlFor="user-info-name" className="control">
              <span>User Name</span>
              <input
                type="text"
                id="user-info-name"
                name="name"
                value={userName}
                onChange={handleNameChange}
              />
            </label>
          </main>

          <footer className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-link"
              onClick={onClose}
              title="Cancel Changes"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              title="Update Info"
            >
              Update
            </button>
          </footer>
        </form>
      </Modal>
    </div>
  );
};

const UserInfoRef = forwardRef(UserInfoElement);

export const UserInfo = ({ isOpen, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appNode = document.getElementById('app');

    if (appNode && overlayRef.current) {
      appNode.appendChild(overlayRef.current);
    }

    return () => {
      if (containerRef.current && overlayRef.current) {
        containerRef.current.appendChild(overlayRef.current);
      }
    };
  }, [overlayRef, isOpen]);

  return (
    <div ref={containerRef}>
      <UserInfoRef ref={overlayRef} isOpen={isOpen} {...props} />
    </div>
  );
};

export default {
  UserInfo,
};
