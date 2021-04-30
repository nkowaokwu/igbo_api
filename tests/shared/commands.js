import chai from 'chai';
import server from '../../src/server';
import {
  API_ROUTE,
  FALLBACK_API_KEY,
  LOCAL_ROUTE,
  TEST_ROUTE,
} from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';
import { options } from 'less';
import wordClass from '../../src/shared/constants/wordClass';

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
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

export const getWord = (id, query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);

export const getExample = (id, query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
);
export const getWordsFilteredByWordClass = (wordClass, query = {}, options = {}) =>(
  chai
  .request(server)
  .get(`${API_ROUTE}/words/wordClass/${wordClass}`)
  .query(query)
  .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
)
/* Searches for examples using the data in MongoDB */
export const getExamples = (query = {}, options = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY)
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
