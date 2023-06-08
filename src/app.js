import './services/firebase';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import './shared/utils/wrapConsole';
import {
  router,
  routerV2,
  siteRouter,
  testRouter,
} from './routers';
import cache from './middleware/cache';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import Version from './shared/constants/Version';
import { CORS_CONFIG } from './config';

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use('*', logger);
}

/* Site config */
app.options('*', cors());
app.use(cors(CORS_CONFIG));
app.set('trust proxy', 1);

/* Provides static assets for the API Homepage */
app.use('/_next', express.static('./dist'));
app.use('/assets', cache(), express.static('./dist/assets'));
app.use('/fonts', cache(), express.static('./dist/fonts'));
app.use('/services', cache(), express.static('./services'));

/* Grabs data from MongoDB */
app.use(`/api/${Version.VERSION_1}`, cache(86400, 172800), router);
app.use(`/api/${Version.VERSION_2}`, cache(86400, 172800), routerV2);

/* Grabs data from JSON dictionary */
if (process.env.NODE_ENV !== 'production') {
  app.use(
    `/api/${Version.VERSION_1}/test`,
    testRouter,
  );
}

/* Renders the API Site */
app.use(siteRouter, cache());

/* Handles all uncaught errors */
app.use(errorHandler);

export default app;

export const api = app;
