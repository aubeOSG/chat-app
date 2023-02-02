export type UserInfo = {
  name: string;
  avatar: {
    key: string;
    label: string;
  };
};

export type User = {
  id: string;
  info: UserInfo;
  rooms: Array<string>;
};