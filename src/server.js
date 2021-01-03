import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import sslRedirect from 'heroku-ssl-redirect';
import morgan from 'morgan';
import * as admin from 'firebase-admin';
import compression from 'compression';
import './shared/utils/wrapConsole';
import { router, siteRouter, testRouter } from './routers';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import {
  PORT,
  MONGO_URI,
  SWAGGER_DOCS,
  SERVICE_ACCOUNT,
  CORS_CONFIG,
} from './config';

admin.default.initializeApp({
  ...SERVICE_ACCOUNT,
  credential: admin.credential.cert(SERVICE_ACCOUNT),
});

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.green('🗄 Database is connected');
});

if (process.env.NODE_ENV === 'production') {
  // enable ssl redirect
  app.use(sslRedirect());
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use('*', logger);
}

app.options('*', cors());

app.use(express.static('./build/dist'));

/* Renders the API Site */
app.use(siteRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCS));

/* Grabs data from MongoDB */
app.use('/api/v1', router);

/* Grabs data from JSON dictionary */
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api/v1/test',
    cors({ ...CORS_CONFIG, origin: true }),
    testRouter,
  );
}

/* Catches all invalid routes and displays the 404 page */
app.get('**', (_, res) => {
  res
    .status(404)
    .sendFile(path.resolve(__dirname, './dist/404.html'));
});
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.green(`🟢 Server started on port ${PORT}`);

  /* Used to test server build */
  if (process.env.NODE_ENV === 'build') {
    console.blue('🧪 Testing server build');
    setTimeout(() => {
      console.green('✅ Build test passed');
      process.exit(0);
    }, 5000);
  }
});

server.clearDatabase = () => {
  mongoose.connection.db.dropDatabase();
};

export default server;
