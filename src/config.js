import * as functions from 'firebase-functions';
import swaggerConfig from '../swagger.json';
import injectWordClass from './shared/utils/injectWordClass';
import './shared/utils/wrapConsole';

const Environment = {
  BUILD: 'build',
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

const config = functions.config();
const dotenv = process.env.NODE_ENV !== 'build' ? require('dotenv') : null;
const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : null;

if (dotenv) {
  dotenv.config();
}

export const isBuild = config?.runtime?.env === Environment.BUILD || process.env.NODE_ENV === 'build';
export const isProduction = config?.runtime?.env === Environment.PRODUCTION || process.env.NODE_ENV === 'production';
export const isDevelopment = config?.runtime?.env === Environment.DEVELOPMENT || process.env.NODE_ENV === 'development';
export const isTest = config?.runtime?.env === Environment.TEST || process.env.NODE_ENV === 'test';
const useReplicaSet = config?.env?.replica_set;

// Database
export const DB_NAME = 'igbo_api';
export const TEST_DB_NAME = 'test_igbo_api';

// If running inside Docker container, it will fallback to using test_igbo_api database
const isTestingEnvironment = (
  isTest
  || (
    process.env.CONTAINER_HOST === 'mongodb'
    && !isDevelopment
    && !isProduction
  )
);
export const PORT = 8080;
export const MONGO_HOST = process.env.CONTAINER_HOST || '127.0.0.1';
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
export const MONGO_ROOT = useReplicaSet ? REPLICA_SET_MONGO_ROOT : FALLBACK_MONGO_ROOT;
export const QUERIES = useReplicaSet ? `?replicaSet=${REPLICA_SET_NAME}` : '';
const TEST_MONGO_URI = `${MONGO_ROOT}/${TEST_DB_NAME}`;
const LOCAL_MONGO_URI = `${MONGO_ROOT}/${DB_NAME}`;
export const MONGO_URI = isTestingEnvironment
  ? TEST_MONGO_URI.concat(QUERIES)
  : isDevelopment
    ? LOCAL_MONGO_URI.concat(QUERIES)
    : config?.env?.mongo_uri
      || LOCAL_MONGO_URI.concat(QUERIES);
export const FIREBASE_CONFIG = config?.env?.firebase_config; // Provide your own Firebase Config
export const CLIENT_TEST = config?.env?.client_test;

export const CORS_CONFIG = {
  origin: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Documentation
const SWAGGER_SETTINGS = {
  title: 'Igbo API',
  version: '1.43.5',
  description: 'Igbo Dictionary API contains Igbo words, definitions, and examples',
  host: `${isProduction ? process.env.DOMAIN_NAME : `localhost:${PORT}`}`,
  schemes: `${isProduction ? ['https'] : ['http']}`,
};

const docs = { ...injectWordClass(swaggerConfig), ...SWAGGER_SETTINGS };
export const SWAGGER_DOCS = docs;
export const SWAGGER_OPTIONS = {
  customSiteTitle: 'Igbo API Documentation',
};

// API Homepage
export const API_ROUTE = isProduction ? '' : `http://localhost:${PORT}`;

// SendGrid API
export const SENDGRID_API_KEY = config?.sendgrid?.api_key || '';
export const SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE = config?.sendgrid?.new_developer_account_template || '';
export const API_FROM_EMAIL = 'kedu@nkowaokwu.com';

if (sgMail && !isTest) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// API Key Secrets
export const MAIN_KEY = config?.env?.main_key || 'main_key';

// Google Analytics
export const GA_TRACKING_ID = config?.analytics?.ga_tracking_id;
export const GA_API_SECRET = config?.analytics?.ga_api_secret;
export const GA_URL = 'https://www.google-analytics.com/mp/collect';
export const DEBUG_GA_URL = 'https://www.google-analytics.com/debug/mp/collect';

// Redis
export const REDIS_HOST = config?.env?.redis_host;
export const REDIS_PORT = config?.env?.redis_port;
export const VPC_CONNECTOR = config?.env?.vpc_connector;
// Busts the cache every 12 hours
export const REDIS_CACHE_EXPIRATION = 60 * 60 * 12;

// GitHub
export const GITHUB_STATS_TOKEN = config?.github?.stats_token;
