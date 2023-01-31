import express from 'express';
import { RegisterEndpoints, RequestEndpoint } from './api.types';

export const registerEndpoint = (router: express.Router, endpoint: RequestEndpoint) => {
  switch (endpoint.method) {
    case 'POST':
      router.post(endpoint.name, endpoint.fn);
      break;
    case 'GET':
    default:
      router.get(endpoint.name, endpoint.fn);
      break;
  }
};

export const registerEndpointAll = (router: express.Router, endpoints: RegisterEndpoints) => {
  for (const key in endpoints) {
    registerEndpoint(router, endpoints[key]);
  }
};

export default {
  registerEndpoint,
  registerEndpointAll,
};