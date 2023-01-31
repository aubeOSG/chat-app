import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  mode: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  socket: process.env.SOCKET || 3000,
};

export default config;