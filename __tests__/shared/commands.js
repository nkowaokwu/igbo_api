import request from 'supertest';
import app from '../../src/app';
import {
  API_ROUTE,
  API_ROUTE_V2,
  FALLBACK_API_KEY,
  LOCAL_ROUTE,
  TEST_ROUTE,
} from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';

const server = request(app);

export const createDeveloper = (data) => (
  server
    .post(`${API_ROUTE}/developers`)
    .send(data)
);

/* Searches for words using the data in MongoDB V2 */
export const getWords = (query = {}, options = {}) => (
  server
    .get(`${API_ROUTE}/words`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

export const getWord = (id, query = {}, options = {}) => (
  server
    .get(`${API_ROUTE}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

/* Searches for words using the data in MongoDB V2 */
export const getWordsV2 = (query = {}, options = {}) => (
  server
    .get(`${API_ROUTE_V2}/words`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

export const getWordV2 = (id, query = {}, options = {}) => (
  server
    .get(`${API_ROUTE_V2}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

/* Searches for examples using the data in MongoDB V1 */
export const getExample = (id, query = {}, options = {}) => (
  server
    .get(`${API_ROUTE}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

export const getExamples = (query = {}, options = {}) => (
  server
    .get(`${API_ROUTE}/examples`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

/* Searches for examples using the data in MongoDB V2 */
export const getExampleV2 = (id, query = {}, options = {}) => (
  server
    .get(`${API_ROUTE_V2}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);
export const getExamplesV2 = (query = {}, options = {}) => (
  server
    .get(`${API_ROUTE_V2}/examples`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

/* Hits the POST /populate route to seed the local MongoDB database */
export const populateAPI = () => (
  server
    .post(`${TEST_ROUTE}/populate`)
);

/* Uses data in JSON */
export const searchTerm = (term) => (
  server
    .get(`${TEST_ROUTE}/words`)
    .query({ keyword: term })
);

export const getLocalUrlRoute = (route = LOCAL_ROUTE) => (
  server
    .get(route)
);

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
  const { wordReg: regexTerm } = createRegExp(term);
  return resultsFromDictionarySearch(regexTerm, term, mockedData);
};

/* fetch developer details */
export const getDeveloper = (options = {}) => (
  server
    .get(`${API_ROUTE}/developers/developer`)
    .set('X-API-Key', options.name || FALLBACK_API_KEY)
);
