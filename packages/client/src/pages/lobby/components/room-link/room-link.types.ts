import React from 'react';
import { Room } from '../../../../models';

export type RoomLinkProps = React.AllHTMLAttributes<HTMLDivElement> & {
  room: Room;
};