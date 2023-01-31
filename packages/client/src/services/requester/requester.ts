import axios, { AxiosPromise } from 'axios';

const timeout = 1000;
const apiUrl = `${window.location.origin}/api`;

axios.interceptors.request
  .use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

axios.interceptors.response
  .use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

export const GET = <D>(endpoint: string, params?: any): AxiosPromise<D> => {
  return new Promise((resolve, reject) => {
    try {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();
      
      axios({
        url: `${apiUrl}${endpoint}`,
        method: 'GET',
        params: params,
        timeout: (timeout * 10),
        cancelToken: source.token,
      }).then((res) => {
        resolve(res);
      }).catch((e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  GET,
};