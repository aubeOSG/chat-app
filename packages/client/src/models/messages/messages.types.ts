import { UserInfo } from '../users';

export type Message = {
  datetime: string;
  user: {
    id: string;
    info: UserInfo;
  };
  content: string;
  roomId?: string;
  messageId?: string;
};