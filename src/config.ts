/* eslint-disable max-len */
import * as functions from 'firebase-functions';
import './shared/utils/wrapConsole';

const Environment = {
  BUILD: 'build',
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

const config = functions.config();
const dotenv = process.env.NODE_ENV !== Environment.BUILD ? require('dotenv') : null;
const sgMail = process.env.NODE_ENV !== Environment.BUILD ? require('@sendgrid/mail') : null;

if (dotenv) {
  dotenv.config();
}

export const isBuild =
  config?.runtime?.env === Environment.BUILD || process.env.NODE_ENV === Environment.BUILD;
export const isProduction =
  config?.runtime?.env === Environment.PRODUCTION ||
  process.env.NODE_ENV === Environment.PRODUCTION;
export const isDevelopment =
  config?.runtime?.env === Environment.DEVELOPMENT ||
  process.env.NODE_ENV === Environment.DEVELOPMENT;
export const isTest =
  config?.runtime?.env === Environment.TEST || process.env.NODE_ENV === Environment.TEST;
const useReplicaSet = config?.env?.replica_set;

// Database
const DB_NAME = 'igbo_api';
const TEST_DB_NAME = 'test_igbo_api';

// If running inside Docker container, it will fallback to using test_igbo_api database
const isTestingEnvironment =
  isTest || (process.env.CONTAINER_HOST === 'mongodb' && !isDevelopment && !isProduction);
export const PORT = 8080;
export const PROD_LIMIT = 2500;
export const MONGO_HOST = process.env.CONTAINER_HOST || '127.0.0.1';
export const REPLICA_SET_NAME = 'rs0';
export const FIRST_REPLICA_SET_PORT = '2717';
export const SECOND_REPLICA_SET_PORT = '2727';
export const THIRD_REPLICA_SET_PORT = '2737';
export const FALLBACK_MONGO_PORT = '27017';
export const REPLICA_SET_MONGO_ROOT =
  `mongodb://${MONGO_HOST}:${FIRST_REPLICA_SET_PORT},` +
  `${MONGO_HOST}:${SECOND_REPLICA_SET_PORT},` +
  `${MONGO_HOST}:${THIRD_REPLICA_SET_PORT}`;
export const FALLBACK_MONGO_ROOT = `mongodb://${MONGO_HOST}:${FALLBACK_MONGO_PORT}`;
export const MONGO_ROOT = useReplicaSet ? REPLICA_SET_MONGO_ROOT : FALLBACK_MONGO_ROOT;
export const QUERIES = useReplicaSet ? `?replicaSet=${REPLICA_SET_NAME}` : '';
const TEST_MONGO_URI = `${MONGO_ROOT}/${TEST_DB_NAME}`;
const LOCAL_MONGO_URI = `${MONGO_ROOT}/${DB_NAME}`;
export const MONGO_URI = isTestingEnvironment
  ? TEST_MONGO_URI.concat(QUERIES)
  : isDevelopment
    ? LOCAL_MONGO_URI.concat(QUERIES)
    : config?.env?.mongo_uri || LOCAL_MONGO_URI.concat(QUERIES);
export const FIREBASE_CONFIG = config?.env?.firebase_config; // Provide your own Firebase Config
export const FIREBASE_SERVICE_ACCOUNT = config?.env?.firebase_service_account; // Provide your own Firebase Service Account
export const CLIENT_TEST = config?.env?.client_test;

export const CORS_CONFIG = {
  origin: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// API Homepage
export const API_ROUTE = isProduction ? '' : `http://localhost:${PORT}`;

// SendGrid API
export const SENDGRID_API_KEY = config?.sendgrid?.api_key || '';
export const SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE =
  config?.sendgrid?.new_developer_account_template || '';
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
export const REDIS_USERNAME = config?.env?.redis_username;
export const REDIS_PASSWORD = config?.env?.redis_password;
export const REDIS_URL = config?.env?.redis_url;
// Busts the cache every 7 days
export const REDIS_CACHE_EXPIRATION = 604800;

// GitHub
export const GITHUB_STATS_TOKEN = config?.github?.stats_token;

// Stripe
export const STRIPE_SECRET_KEY =
  config?.env?.stripe_secret_key || 'sk_test_hpwuITjteocLizB8Afq7H3cV00FEEViC1s';
export const STRIPE_ENDPOINT_SECRET = config?.env?.stripe_endpoint_secret || 'local_endpoint';
