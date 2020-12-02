import { secrets as dockerSecrets } from 'docker-secret';
import * as packageJson from '../package.json';
import swaggerDocument from '../swagger.json';

const dotenv = process.env.NODE_ENV !== 'build' ? require('dotenv') : null;
const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : null;

if (dotenv) {
  dotenv.config();
}

// Database
const DB_NAME = 'igbo_api';
const TEST_DB_NAME = 'test_igbo_api';

export const PORT = process.env.PORT || 8080;
export const MONGO_HOST = process.env.CONTAINER_HOST || 'localhost';
export const MONGO_ROOT = `mongodb://${MONGO_HOST}:27017`;
const TEST_MONGO_URI = `${MONGO_ROOT}/${TEST_DB_NAME}`;
const LOCAL_MONGO_URI = `${MONGO_ROOT}/${DB_NAME}`;
export const MONGO_URI = process.env.NODE_ENV === 'test'
  ? TEST_MONGO_URI
  : process.env.NODE_ENV === 'development'
    ? LOCAL_MONGO_URI
    : process.env.MONGO_URI || LOCAL_MONGO_URI;

// Documentation
const SWAGGER_OPTIONS = {
  title: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  host: `${process.env.NODE_ENV !== 'production' ? `localhost:${PORT}` : process.env.DOMAIN_NAME}`,
  basePath: '/api/v1/',
};
const docs = { ...swaggerDocument, SWAGGER_OPTIONS };
export const SWAGGER_DOCS = docs;

// API Homepage
export const API_ROUTE = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${PORT}`;

// Dictionary App
export const DICTIONARY_APP_URL = process.env.NODE_ENV === 'production'
  ? 'https://nkowaokwu.com'
  : 'http://localhost:8000'; // A local instance of the dictionary app must be running

// SendGrid API
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const MERGED_SUGGESTION_TEMPLATE = process.env.MERGED_SUGGESTION_TEMPLATE || '';
export const REJECTED_SUGGESTION_TEMPLATE = process.env.REJECTED_SUGGESTION_TEMPLATE || '';
export const MERGED_STATS_TEMPLATE = process.env.MERGED_STATS_TEMPLATE || '';
export const API_FROM_EMAIL = process.env.API_FROM_EMAIL || 'igboapi@gmail.com';
export const NKOWAOKWU_FROM_EMAIL = process.env.NKOWAOKWU_FROM_EMAIL || 'nkowaokwu@gmail.com';

if (sgMail) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Firebase service account
export const SERVICE_ACCOUNT = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : process.env.CI === 'test'
    ? JSON.parse(process.env.FIREBASE_CONFIG)
    : process.env.NODE_ENV === 'test'
      ? JSON.parse(dockerSecrets.FIREBASE_CONFIG)
      : '';
