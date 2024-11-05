import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { CORS_CONFIG } from './config';
import { onDemo } from './functions';
import cache from './middleware/cache';
import errorHandler from './middleware/errorHandler';
import logger from './middleware/logger';
import { router, routerV2, siteRouter, stripeRouter } from './routers';
import './services/firebase';
import './services/firebase-admin';
import Version from './shared/constants/Version';
import './shared/utils/wrapConsole';

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
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

/* Stripe */
app.use('/stripe', stripeRouter);

/* Renders the API Site */
app.use(siteRouter, cache());

/* Handles all uncaught errors */
app.use(errorHandler);

export default app;

export const api = app;
export const demo = onDemo;
