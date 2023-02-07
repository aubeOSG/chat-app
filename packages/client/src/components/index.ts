import * as avatar from './avatar';
import * as overlay from './overlay';

export * from './avatar/avatar.types';
export const Avatar = avatar.Avatar;

export * from './overlay/overlay.types';
export const Modal = overlay.Modal;

export default {
  Avatar,
  Modal,
};