import chai from 'chai';
import server from '../../src/server';
import { EDIT_API_ROUTE, TEST_ROUTE, WORDS_API_ROUTE } from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';

export const getWordSuggestions = (query = {}) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/words`)
    .query(query)
);

export const getWordSuggestion = (id) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/words/${id}`)
);

export const getExampleSuggestions = (query = {}) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/examples`)
    .query(query)
);

export const getExampleSuggestion = (id) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/examples/${id}`)
);

export const getGenericWords = (query = {}) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/genericWords`)
    .query(query)
);

export const getGenericWord = (id) => (
  chai
    .request(server)
    .get(`${EDIT_API_ROUTE}/genericWords/${id}`)
);

export const suggestNewWord = (data) => (
  chai
    .request(server)
    .post(`${EDIT_API_ROUTE}/words`)
    .send(data)
);

export const suggestNewExample = (data) => (
  chai
    .request(server)
    .post(`${EDIT_API_ROUTE}/examples`)
    .send(data)
);

export const updateWordSuggestion = (data) => (
  chai
    .request(server)
    .put(`${EDIT_API_ROUTE}/words`)
    .send(data)
);

export const updateExampleSuggestion = (data) => (
  chai
    .request(server)
    .put(`${EDIT_API_ROUTE}/examples`)
    .send(data)
);

/* Searches for words using the data in MongoDB */
export const searchAPIByWord = (query = {}) => (
  chai
    .request(server)
    .get(WORDS_API_ROUTE)
    .query(query)
);

/* Hits the POST /populate route to seed the local MongoDB database */
export const populateAPI = () => (
  chai
    .request(server)
    .post(`${TEST_ROUTE}/populate`)
);

export const populateGenericWordsAPI = () => (
  chai
    .request(server)
    .post(`${EDIT_API_ROUTE}/genericWords`)
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
