import chai from 'chai';
import server from '../../src/server';
import {
  API_ROUTE,
  API_KEY,
  API_URL,
  AUTH_TOKEN,
  ORIGIN_HEADER,
  LOCAL_ROUTE,
  TEST_ROUTE,
} from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';

export const createDeveloper = (data) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/developers`)
    .send(data)
);

/* Searches for words using the data in MongoDB */
export const getWords = (query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words`)
    .query(query)
    .set('Authorization', `Bearer ${query.token || AUTH_TOKEN.ADMIN_AUTH_TOKEN}`)
    .set('X-API-Key', options.apiKey || API_KEY)
    .set('Origin', options.origin || ORIGIN_HEADER)
);

export const getWord = (id, query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || API_KEY)
    .set('Origin', options.origin || ORIGIN_HEADER)
);

export const getExample = (id, query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || API_KEY)
    .set('Origin', options.origin || ORIGIN_HEADER)
);

/* Searches for examples using the data in MongoDB */
export const getExamples = (query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples`)
    .query(query)
    .set('Authorization', `Bearer ${query.token || AUTH_TOKEN.ADMIN_AUTH_TOKEN}`)
    .set('X-API-Key', options.apiKey || API_KEY)
    .set('Origin', options.origin || ORIGIN_HEADER)
);

/* Hits the POST /populate route to seed the local MongoDB database */
export const populateAPI = () => (
  chai
    .request(server)
    .post(`${TEST_ROUTE}/populate`)
);

/* Uses data in JSON */
export const searchTerm = (term) => (
  chai
    .request(server)
    .get(`${TEST_ROUTE}/words`)
    .query({ keyword: term })
);

export const getAPIUrlRoute = (route = LOCAL_ROUTE) => (
  chai
    .request(API_URL)
    .get(route)
);

export const getLocalUrlRoute = (route = LOCAL_ROUTE) => (
  chai
    .request(server)
    .get(route)
);

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
  const regexTerm = createRegExp(term);
  return resultsFromDictionarySearch(regexTerm, term, mockedData);
};
