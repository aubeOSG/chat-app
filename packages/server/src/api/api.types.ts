import express from 'express';

export type RequestEndpoint = {
  name: string;
  method: 'GET' | 'POST';
  fn: express.Handler;
};

export type RegisterEndpoints = {
  [key: string]: RequestEndpoint;
};