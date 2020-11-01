import chai from 'chai';
import server from '../../src/server';
import { API_ROUTE, TEST_ROUTE } from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';

export const getWordSuggestions = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/wordSuggestions`)
    .query(query)
);

export const getWordSuggestion = (id) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/wordSuggestions/${id}`)
);

export const getExampleSuggestions = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/exampleSuggestions`)
    .query(query)
);

export const getExampleSuggestion = (id) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/exampleSuggestions/${id}`)
);

export const getGenericWords = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/genericWords`)
    .query(query)
);

export const getGenericWord = (id) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/genericWords/${id}`)
);

export const createWord = (data, query = {}) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/words`)
    .query(query)
    .send(data)
);

export const createExample = (data, query = {}) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/examples`)
    .query(query)
    .send(data)
);

export const suggestNewWord = (data) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/wordSuggestions`)
    .send(data)
);

export const suggestNewExample = (data) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/exampleSuggestions`)
    .send(data)
);

export const updateWordSuggestion = (id, data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/wordSuggestions/${id}`)
    .send(data)
);

export const deleteWordSuggestion = (id) => (
  chai
    .request(server)
    .delete(`${API_ROUTE}/wordSuggestions/${id}`)
);

export const updateExampleSuggestion = (id, data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/exampleSuggestions/${id}`)
    .send(data)
);

export const updateGenericWord = (id, data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/genericWords/${id}`)
    .send(data)
);

export const updateWord = (id, data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/words/${id}`)
    .send(data)
);

export const updateExample = (id, data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/examples/${id}`)
    .send(data)
);

/* Searches for words using the data in MongoDB */
export const getWords = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words`)
    .query(query)
);

export const getWord = (id) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words/${id}`)
);

export const getExample = (id) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples/${id}`)
);

/* Searches for examples using the data in MongoDB */
export const getExamples = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/examples`)
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
    .post(`${API_ROUTE}/genericWords`)
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
