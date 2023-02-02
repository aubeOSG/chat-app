export type UserInfo = {
  name: string;
  avatar: {
    label: string;
    key: string;
  };
};

export type User = {
  id: string;
  info: UserInfo;
  rooms: Array<string>;
};