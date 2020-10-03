import chai from 'chai';
import server from '../../server';
import { API_ROUTE, TEST_ROUTE } from './constants';
import { createRegExp } from '../../controllers/words';
import { resultsFromDictionarySearch } from '../../services/words';
import mockedData from '../__mocks__/data.mock.json';

/* Uses the data in MongoDB */
export const searchAPITerm = (term) => {
    return chai.request(server)
        .get(API_ROUTE)
        .query({ keyword: term });
};

/* Hits the POST /populate route to seed the local MongoDB database */
export const populateAPI = () => {
    return chai.request(server)
        .post(`${TEST_ROUTE}/populate`);
};

/* Uses data in JSON */
export const searchTerm = (term) => {
    return chai.request(server)
                .get(`${TEST_ROUTE}/words`)
                .query({ keyword: term });
};

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
    const regexTerm = createRegExp(term);
    return resultsFromDictionarySearch(regexTerm, term, mockedData);
};