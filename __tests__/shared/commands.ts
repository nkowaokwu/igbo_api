import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../src/app';
import { API_ROUTE, API_ROUTE_V2, FALLBACK_API_KEY, LOCAL_ROUTE, TEST_ROUTE } from './constants';
import createRegExp from '../../src/shared/utils/createRegExp';
import { resultsFromDictionarySearch } from '../../src/services/words';
import mockedData from '../__mocks__/data.mock.json';
import ExampleStyleEnum from '../../src/shared/constants/ExampleStyleEnum';

type Id = string | Types.ObjectId;

type Query = Partial<{
  range: string | [number, number] | boolean,
  keyword: string,
  style: ExampleStyleEnum,
  page: string | number,
  apiLimit: number,
  dialects: string | boolean,
  examples: string | boolean,
  strict: string | boolean,
  wordClasses: string | string[],
  filter: Partial<{ word: string }> | string,
}>;
type Options = Partial<{
  apiKey: string,
  origin: string,
}>;

const server = request(app);

export const createDeveloper = (data: object) => server.post(`${API_ROUTE}/developers`).send(data);

/* Searches for words using the data in MongoDB V2 */
export const getWords = (query: Query, options: Options) =>
  server
    .get(`${API_ROUTE}/words`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

export const getWord = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Searches for words using the data in MongoDB V2 */
export const getWordsV2 = (query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/words`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

export const getWordV2 = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/words/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Searches for examples using the data in MongoDB V1 */
export const getExample = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

export const getExamples = (query: Query, options: Options) =>
  server
    .get(`${API_ROUTE}/examples`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Searches for examples using the data in MongoDB V2 */
export const getExampleV2 = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/examples/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);
export const getExamplesV2 = (query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/examples`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Searches for Nsibidi characters using the data in MongoDB V1 */
export const getNsibidiCharacter = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE}/nsibidi/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Searches for Nsibidi characters using the data in MongoDB V2 */
export const getNsibidiCharacterV2 = (id: Id, query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/nsibidi/${id}`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

export const getNsibidiCharactersV2 = (query: Query, options: Options) =>
  server
    .get(`${API_ROUTE_V2}/nsibidi`)
    .query(query)
    .set('X-API-Key', options.apiKey || FALLBACK_API_KEY);

/* Hits the POST /populate route to seed the local MongoDB database */
export const populateAPI = () => server.post(`${TEST_ROUTE}/populate`);

/* Uses data in JSON */
export const searchTerm = (term?: string) =>
  server.get(`${TEST_ROUTE}/words`).query({ keyword: term || '' });

export const getLocalUrlRoute = (route = LOCAL_ROUTE) => server.get(route);

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term: string) => {
  const { wordReg: regexTerm } = createRegExp(term);
  return resultsFromDictionarySearch(regexTerm, term, mockedData);
};
