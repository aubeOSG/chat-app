import * as Overlays from './overlays';
import * as room from './room';
import * as roomLink from './room-link';
import * as document from './document';

export const overlays = Overlays;
export const Room = room.Room;

export * from './room-link/room-link.types';
export const RoomLink = roomLink.RoomLink;

export * from './document/document.types';
export const Document = document.Document;
export const Editor = document.Editor;

export default {
  overlays,
  Room,
  RoomLink,
  Document,
  Editor,
};
