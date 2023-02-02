import React from 'react';
import { AvatarProps } from './avatar.types';
import { avatars } from '../../models';

export const Avatar = ({ children, ...props }: AvatarProps) => {
  const data = avatars.api.get(children?.toString() || '');

  return (
    <div className="avatar">
      <img src={data?.image} />
    </div>
  );
};

export default {
  Avatar,
};
