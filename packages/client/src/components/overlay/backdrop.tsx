import React from 'react';
import { motion } from 'framer-motion';

export const Backdrop = ({ onClick, ...props }) => {
  let classes = `overlay-backdrop`;

  if (props.className) {
    classes += ` ${props.className}`;
  }

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
    />
  );
};

export default {
  Backdrop,
};
