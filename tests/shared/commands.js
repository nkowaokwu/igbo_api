import chai from 'chai';
import server from '../../src/server';
import { WORDS_API_ROUTE, PHRASES_API_ROUTE, TEST_ROUTE } from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';

/* Searches for words using the data in MongoDB */
export const searchAPIByWord = (query = {}) => (
  chai
    .request(server)
    .get(WORDS_API_ROUTE)
    .query(query)
);

/* Searches for phrases using the data in MongoDB */
export const searchAPIByPhrase = (query = {}) => (
  chai
    .request(server)
    .get(PHRASES_API_ROUTE)
    .query(query)
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

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
  const regexTerm = createRegExp(term);
  return resultsFromDictionarySearch(regexTerm, term, mockedData);
};
