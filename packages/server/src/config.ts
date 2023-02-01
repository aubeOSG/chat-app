import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  mode: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  socket: parseInt(process.env.SOCKET || '3000', 10),
};

export default config;