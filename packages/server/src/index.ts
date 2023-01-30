import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

const app = express();
const staticPath = path.join(process.cwd(), '../client/dist');
const appPath = path.join(staticPath, 'index.html');

app.set('json spaces', 2);
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(staticPath));

app.get('/', (req, res) => {
  res.sendFile(appPath);
});

app.listen(config.port, () => {
  console.info(`Chat App running at http://localhost:${config.port}/`);
});