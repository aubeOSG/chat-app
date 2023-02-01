import path from 'path';
import fs from 'fs';
import express from 'express';

const staticPath = path.join(process.cwd(), '../client/dist');
const appPath = path.join(staticPath, 'index.html');

export const init = (app: express.Application) => {
  console.log('staticPath', staticPath);
  console.log('path exists', fs.existsSync(staticPath));
  app.use('/public', express.static(staticPath));

  app.get('/app', (req, res) => {
    res.sendFile(appPath);
  });

  app.get('/app/*', (req, res) => {
    res.sendFile(appPath);
  });

  app.get('*', (req, res) => {
    res.sendFile(appPath);
  });
};

export default {
  init,
};