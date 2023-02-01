import path from 'path';
import express from 'express';

const staticPath = path.join(process.cwd(), '../client/dist');
const appPath = path.join(staticPath, 'index.html');

export const init = (app: express.Application) => {
  app.use('/public', express.static(staticPath));

  app.get('/app', (req, res) => {
    res.sendFile(appPath);
  });

  app.get('/app/*', (req, res) => {
    res.sendFile(appPath);
  });

  app.get('*', (req, res) => {
    res.redirect('/app');
  });
};

export default {
  init,
};