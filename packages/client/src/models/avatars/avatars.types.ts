export type Avatar = {
  label: string;
  key: string;
};

export type AvatarData = {
  label: string;
  color: string;
  image: string;
};

export type Avatars = {
  [key: string]: AvatarData;
};