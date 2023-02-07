import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Modal } from '../../../../../components';

const CreateRoomElement = ({ isOpen, onClose, ...props }, ref) => {
  const title = 'Create Room';
  const [roomName, setRoomName] = useState<string>('');

  const handleNameChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const val = ev.currentTarget.value;

    setRoomName(val);
  };

  const handleCreateRoom = () => {
    if (!roomName) {
      return;
    }

    onClose(roomName);
  };

  useEffect(() => {
    if (isOpen) {
      setRoomName('');
    }
  }, [isOpen]);

  return (
    <div ref={ref}>
      <Modal
        className="modal-create-room"
        title={title}
        isOpen={isOpen}
        onClose={() => onClose()}
      >
        <main className="overlay-create-room">
          <label htmlFor="create-room-name">
            <span>Room Name: </span>
            <input
              type="text"
              id="create-room-name"
              value={roomName}
              onChange={handleNameChange}
            />
          </label>
        </main>

        <footer className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => onClose()}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleCreateRoom}
          >
            Create
          </button>
        </footer>
      </Modal>
    </div>
  );
};

const CreateRoomRef = forwardRef(CreateRoomElement);

export const CreateRoom = ({ isOpen, ...props }) => {
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
      <CreateRoomRef ref={overlayRef} isOpen={isOpen} {...props} />
    </div>
  );
};

export default {
  CreateRoom,
};
