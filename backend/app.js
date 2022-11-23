import path from 'path';
import { constants } from 'http2';
import { fileURLToPath } from 'url';
// libs
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
// routes
import { router } from './routes/index.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const run = async (envName) => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const config = dotenv.config({ path: path.resolve(__dirname, '.env.common') }).parsed;
  if (!config) {
    throw new Error('Config not found');
  }
  config.NODE_ENV = envName;

  const app = express();

  app.set('config', config);
  app.use(bodyParser.json());
  app.use(router);
  app.use(errors());
  app.use((err, req, res, next) => {
    const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const message = err.message || 'Неизвестная ошибка';
    res.status(status).send({ message });
    next();
  });

  mongoose.set('runValidators', true);
  await mongoose.connect(config.DB_URL);
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Server run on http://${config.HOST}:${config.PORT}`);
    process.send('ready');
  });

  const stop = async () => {
    console.log('Stop database');
    await mongoose.connection.close();
    console.log('Stop server');
    server.close();
    console.log('App stopped successfully');
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
