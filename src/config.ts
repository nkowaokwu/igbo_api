/* eslint-disable max-len */
import { defineBoolean, defineInt, defineString } from 'firebase-functions/params';
import './shared/utils/wrapConsole';

export const Environment = {
  BUILD: 'build',
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

// Firebase
const RUNTIME_ENV = defineString('RUNTIME_ENV').value();
const ENV_REPLICA_SET = defineBoolean('ENV_REPLICA_SET').value();
const ENV_MONGO_URI = defineString('ENV_MONGO_URI').value();
const ENV_FIREBASE_CONFIG = defineString('ENV_FIREBASE_CONFIG').value();
const ENV_FIREBASE_SERVICE_ACCOUNT = defineString('ENV_FIREBASE_SERVICE_ACCOUNT').value();
const ENV_CLIENT_TEST = defineBoolean('ENV_CLIENT_TEST').value();

// SendGrid
const SENDGRID_API_KEY_SOURCE = defineString('SENDGRID_API_KEY').value();
const SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE_SOURCE = defineString(
  'SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE'
).value();

// Igbo API
const ENV_MAIN_KEY = defineString('ENV_MAIN_KEY').value();

// Nkọwa okwu AI Models
const ENV_IGBO_TO_ENGLISH_URL = defineString('ENV_IGBO_TO_ENGLISH_URL').value();

// Google Analytics
const ANALYTICS_GA_TRACKING_ID = defineString('ANALYTICS_GA_TRACKING_ID').value();
const ANALYTICS_GA_API_SECRET = defineString('ANALYTICS_GA_API_SECRET').value();

// Redis
const ENV_REDIS_PORT = defineInt('ENV_REDIS_PORT').value();
const ENV_REDIS_URL = defineString('ENV_REDIS_URL').value();
const ENV_REDIS_HOST = defineString('ENV_REDIS_HOST').value();
const ENV_REDIS_USERNAME = defineString('ENV_REDIS_USERNAME').value();
const ENV_REDIS_PASSWORD = defineString('ENV_REDIS_PASSWORD').value();

// GitHub
const GITHUB_STATS_TOKEN_SOURCE = defineString('GITHUB_STATS_TOKEN').value();

// Stripe
const STRIPE_SECRET_KEY_SOURCE = defineString('STRIPE_SECRET_KEY').value();
const STRIPE_ENDPOINT_SECRET_SOURCE = defineString('STRIPE_ENDPOINT_SECRET').value();

const dotenv = process.env.NODE_ENV !== Environment.BUILD ? require('dotenv') : null;

if (dotenv) {
  dotenv.config();
}

export const isBuild =
  RUNTIME_ENV === Environment.BUILD || process.env.NODE_ENV === Environment.BUILD;
export const isProduction =
  RUNTIME_ENV === Environment.PRODUCTION || process.env.NODE_ENV === Environment.PRODUCTION;
export const isDevelopment =
  RUNTIME_ENV === Environment.DEVELOPMENT || process.env.NODE_ENV === Environment.DEVELOPMENT;
export const isTest = RUNTIME_ENV === Environment.TEST || process.env.NODE_ENV === Environment.TEST;
const useReplicaSet = ENV_REPLICA_SET;

// Database
const DB_NAME = 'igbo_api';
const TEST_DB_NAME = 'test_igbo_api';

// If running inside Docker container, it will fallback to using test_igbo_api database
const isTestingEnvironment =
  isTest || (process.env.CONTAINER_HOST === 'mongodb' && !isDevelopment && !isProduction);
export const PORT = process.env.PORT || 8080;
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
    : ENV_MONGO_URI || LOCAL_MONGO_URI.concat(QUERIES);
export const FIREBASE_CONFIG = ENV_FIREBASE_CONFIG; // Provide your own Firebase Config
export const FIREBASE_SERVICE_ACCOUNT = ENV_FIREBASE_SERVICE_ACCOUNT; // Provide your own Firebase Service Account
export const CLIENT_TEST = ENV_CLIENT_TEST;

export const CORS_CONFIG = {
  origin: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// API Homepage
export const API_ROUTE = isProduction ? 'https://igboapi.com' : `http://localhost:8080`; //${PORT}`;
export const API_DOCS = 'https://docs.igboapi.com';

// Nkọwa okwu AI Models
export const SPEECH_TO_TEXT_API = isProduction
  ? 'https://speech.igboapi.com'
  : 'http://localhost:3333';
export const IGBO_TO_ENGLISH_API = ENV_IGBO_TO_ENGLISH_URL;
// SendGrid API
export const SENDGRID_API_KEY = SENDGRID_API_KEY_SOURCE || '';
export const SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE =
  SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE_SOURCE;
export const API_FROM_EMAIL = 'kedu@nkowaokwu.com';

if (process.env.NODE_ENV !== Environment.BUILD && !isTest) {
  const sgMail = require('@sendgrid/mail'); // eslint-disable-line
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// API Key Secrets
export const MAIN_KEY = ENV_MAIN_KEY || 'main_key';

// Google Analytics
export const GA_TRACKING_ID = ANALYTICS_GA_TRACKING_ID;
export const GA_API_SECRET = ANALYTICS_GA_API_SECRET;
export const GA_URL = 'https://www.google-analytics.com/mp/collect';
export const DEBUG_GA_URL = 'https://www.google-analytics.com/debug/mp/collect';

// Redis
export const REDIS_HOST = ENV_REDIS_HOST;
export const REDIS_PORT = ENV_REDIS_PORT;
export const REDIS_USERNAME = ENV_REDIS_USERNAME;
export const REDIS_PASSWORD = ENV_REDIS_PASSWORD;
export const REDIS_URL = ENV_REDIS_URL;
// Busts the cache every 7 days
export const REDIS_CACHE_EXPIRATION = 604800;

// GitHub
export const GITHUB_STATS_TOKEN = GITHUB_STATS_TOKEN_SOURCE;

// Stripe
export const STRIPE_SECRET_KEY =
  STRIPE_SECRET_KEY_SOURCE || 'sk_test_hpwuITjteocLizB8Afq7H3cV00FEEViC1s';
export const STRIPE_ENDPOINT_SECRET = STRIPE_ENDPOINT_SECRET_SOURCE || 'local_endpoint';
