import { User, UserInfo } from '../users';

export type Message = {
  id: string;
  createdAt: string;
  roomId: string;
  user: {
    id: string;
    info: UserInfo;
  };
  content: string;
};

export type NewMessage = {
  roomId: string;
  user: User;
  content: string;
};