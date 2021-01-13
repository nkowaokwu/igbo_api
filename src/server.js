import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import sslRedirect from 'heroku-ssl-redirect';
import morgan from 'morgan';
import compression from 'compression';
import './shared/utils/wrapConsole';
import { router, siteRouter, testRouter } from './routers';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import {
  PORT,
  MONGO_URI,
  SWAGGER_DOCS,
  CORS_CONFIG,
  SWAGGER_OPTIONS,
} from './config';

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

if (process.env.HEROKU) {
  // enable ssl redirect
  app.use(sslRedirect());
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use('*', logger);
}

app.options('*', cors());
app.use(cors(CORS_CONFIG));
app.set('trust proxy', 1);

/* Provides static assets for the API Homepage */
app.use('/_next', express.static('./build/dist'));
app.use('/assets', express.static('./build/dist/assets'));
app.use('/fonts', express.static('./build/dist/fonts'));
app.use('/services', express.static('./services'));

/* Renders the API Site */
app.use(siteRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCS, SWAGGER_OPTIONS));

/* Grabs data from MongoDB */
app.use('/api/v1', router);

/* Grabs data from JSON dictionary */
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api/v1/test',
    testRouter,
  );
}

/* Catches all invalid routes and displays the 404 page */
app.get('**', (_, res) => (
  res.redirect('/')
));
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
