import React from 'react';
import { IconProps } from './icon.types';

export const Icon = ({ className, symbol, ...props }: IconProps) => {
  const classes = `material-symbols-outlined icon ${className || ''}`;

  return (
    <span className={classes} {...props}>
      {symbol}
    </span>
  );
};

export default {
  Icon,
};
