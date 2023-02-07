import React from 'react';
import { AvatarProps } from './avatar.types';
import { avatars } from '../../models';

export const Avatar = ({ className, children, ...props }: AvatarProps) => {
  const classes = `avatar ${className}`;
  const data = avatars.api.get(children?.toString() || '');

  return (
    <div className={classes}>
      <img src={data?.image} />
    </div>
  );
};

export default {
  Avatar,
};
