import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import { api } from './api';

const app = express();
const host = config.mode === 'development' ? 'localhost' : '0.0.0.0';

app.set('json spaces', 2);
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

api.init(app, host);
routes.init(app);

app.listen(config.port, () => {

  if (config.mode === 'development') {
    console.info(`Chat App running at http://localhost:${config.port}/app`);
  } else {
    console.info(`Chat App running on ${config.port}`);
  }
});