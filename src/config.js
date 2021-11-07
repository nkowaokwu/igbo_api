import * as packageJson from '../package.json';
import swaggerConfig from '../swagger.json';
import './shared/utils/wrapConsole';

const dotenv = process.env.NODE_ENV !== 'build' ? require('dotenv') : null;
const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : null;

if (dotenv) {
  dotenv.config();
}

const useReplicatSet = !!process.env.REPLICA_SET;

// Database
export const DB_NAME = 'igbo_api';
export const TEST_DB_NAME = 'test_igbo_api';

// If running inside Docker container, it will fallback to using test_igbo_api database
const isTestingEnvironment = (
  process.env.NODE_ENV === 'test'
  || (
    process.env.CONTAINER_HOST === 'mongodb'
    && process.env.NODE_ENV !== 'development'
    && process.env.NODE_ENV !== 'production'
  )
);
export const PORT = process.env.PORT || 8080;
export const MONGO_HOST = process.env.CONTAINER_HOST || 'localhost';
export const REPLICA_SET_NAME = 'rs0';
export const FIRST_REPLICA_SET_PORT = '2717';
export const SECOND_REPLICA_SET_PORT = '2727';
export const THIRD_REPLICA_SET_PORT = '2737';
export const FALLBACK_MONGO_PORT = '27017';
export const REPLICA_SET_MONGO_ROOT = (
  `mongodb://${MONGO_HOST}:${FIRST_REPLICA_SET_PORT},`
  + `${MONGO_HOST}:${SECOND_REPLICA_SET_PORT},`
  + `${MONGO_HOST}:${THIRD_REPLICA_SET_PORT}`
);
export const FALLBACK_MONGO_ROOT = `mongodb://${MONGO_HOST}:${FALLBACK_MONGO_PORT}`;
export const MONGO_ROOT = useReplicatSet ? REPLICA_SET_MONGO_ROOT : FALLBACK_MONGO_ROOT;
export const QUERIES = useReplicatSet ? `?replicaSet=${REPLICA_SET_NAME}` : '';
const TEST_MONGO_URI = `${MONGO_ROOT}/${TEST_DB_NAME}`;
const LOCAL_MONGO_URI = `${MONGO_ROOT}/${DB_NAME}`;
export const MONGO_URI = isTestingEnvironment
  ? TEST_MONGO_URI.concat(QUERIES)
  : process.env.NODE_ENV === 'development'
    ? LOCAL_MONGO_URI.concat(QUERIES)
    : process.env.MONGO_URI
      || LOCAL_MONGO_URI.concat(QUERIES);

console.green('🛣  MongoDB URI:', MONGO_URI);

export const CORS_CONFIG = {
  origin: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Documentation
const SWAGGER_SETTINGS = {
  title: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  host: `${process.env.HEROKU ? process.env.DOMAIN_NAME : `localhost:${PORT}`}`,
  schemes: `${process.env.HEROKU ? ['https'] : ['http']}`,
};

const docs = { ...swaggerConfig, ...SWAGGER_SETTINGS };
export const SWAGGER_DOCS = docs;
export const SWAGGER_OPTIONS = {
  customSiteTitle: 'Igbo API Documentation',
};

// API Homepage
export const API_ROUTE = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${PORT}`;

// SendGrid API
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const NEW_DEVELOPER_ACCOUNT_TEMPLATE = process.env.NEW_DEVELOPER_ACCOUNT_TEMPLATE || '';
export const API_FROM_EMAIL = process.env.API_FROM_EMAIL || 'igboapi@gmail.com';

if (sgMail) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// API Key Secrets
export const MAIN_KEY = process.env.MAIN_KEY || 'main_key';
