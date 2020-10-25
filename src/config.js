import * as packageJson from '../package.json';
import swaggerDocument from '../swagger.json';

// Database
const DB_NAME = 'igbo_api';
const TEST_DB_NAME = 'test_igbo_api';

export const PORT = process.env.PORT || 8080;
export const MONGO_ROOT = 'mongodb://localhost:27017';
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
export const API_ROUTE = process.env.NODE_ENV === 'production' ? 'http://igboapi.com' : `http://localhost:${PORT}`;
export const DICTIONARY_APP_URL = 'https://ijemmao.github.io/igbo_api';
