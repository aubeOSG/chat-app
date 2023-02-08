import * as avatar from './avatar';
import * as overlay from './overlay';
import * as icon from './icon';

export * from './avatar/avatar.types';
export const Avatar = avatar.Avatar;

export * from './overlay/overlay.types';
export const Modal = overlay.Modal;

export * from './icon/icon.types';
export const Icon = icon.Icon;

export default {
  Avatar,
  Modal,
  Icon,
};