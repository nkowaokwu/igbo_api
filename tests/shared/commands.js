import chai from 'chai';
import server from '../../src/server';
import {
  API_ROUTE,
  TEST_ROUTE,
  API_URL,
  AUTH_TOKEN,
  LOCAL_ROUTE,
} from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import { sendEmail } from '../../src/controllers/email';
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

export const deleteWordSuggestion = (id) => (
  chai
    .request(server)
    .delete(`${API_ROUTE}/wordSuggestions/${id}`)
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

export const deleteExampleSuggestion = (id) => (
  chai
    .request(server)
    .delete(`${API_ROUTE}/exampleSuggestions/${id}`)
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

export const deleteGenericWord = (id) => (
  chai
    .request(server)
    .delete(`${API_ROUTE}/genericWords/${id}`)
);

export const createWord = (id, query = {}) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/words`)
    .query(query)
    .send({ id })
);

export const deleteWord = (id, primaryWordId) => (
  chai
    .request(server)
    .delete(`${API_ROUTE}/words/${id}`)
    .send({ primaryWordId })
);

export const createExample = (id, query = {}) => (
  chai
    .request(server)
    .post(`${API_ROUTE}/examples`)
    .query(query)
    .send({ id })
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

export const updateWordSuggestion = (data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/wordSuggestions/${data.id}`)
    .send(data)
);

export const updateExampleSuggestion = (data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/exampleSuggestions/${data.id}`)
    .send(data)
);

export const updateGenericWord = (data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/genericWords/${data.id}`)
    .send(data)
);

export const updateWord = (data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/words/${data.id}`)
    .send(data)
);

export const updateExample = (data) => (
  chai
    .request(server)
    .put(`${API_ROUTE}/examples/${data.id}`)
    .send(data)
);

export const approveWordSuggestion = (data) => {
  const approvedData = data;
  approvedData.approvals.push('approval');
  return updateWordSuggestion(data.id, data);
};

export const approveExampleSuggestion = (data) => {
  const approvedData = data;
  approvedData.approvals.push('approval');
  return updateExampleSuggestion(data.id, data);
};

export const approveGenericWord = (data) => {
  const approvedData = data;
  approvedData.approvals.push('approval');
  return updateGenericWord(data.id, data);
};

/* Searches for words using the data in MongoDB */
export const getWords = (query = {}) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/words`)
    .query(query)
    .set('Authorization', `Bearer ${query.token || AUTH_TOKEN.ADMIN_AUTH_TOKEN}`)
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
    .set('Authorization', `Bearer ${query.token || AUTH_TOKEN.ADMIN_AUTH_TOKEN}`)
);

/* Mocks grabbing all users from Firebase */
export const getUsers = (token = AUTH_TOKEN.ADMIN_AUTH_TOKEN) => (
  chai
    .request(server)
    .get(`${API_ROUTE}/users`)
    .set('Authorization', `Bearer ${token}`)
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

/* Sends an email to all editors, mergers, and admins about
 * merged words and examples.
 */
export const sendEmailJob = () => (
  chai
    .request(server)
    .post(`${TEST_ROUTE}/email/mergedStats`)
);

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
  const regexTerm = createRegExp(term);
  return resultsFromDictionarySearch(regexTerm, term, mockedData);
};

export const sendSendGridEmail = (message) => sendEmail(message);
