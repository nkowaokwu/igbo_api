import chai from 'chai';
import server from '../../server';
import { API_ROUTE, JSON_ROUTE } from './constants';
import { createRegExp } from '../../controllers/words';
import { resultsFromDictionarySearch } from '../../services/words';
import mockedData from '../__mocks__/data.mock.json';

/* Hits the POST /populate route to seed the local database */
export const populateAPI = () => {
    return chai.request(server)
        .post(`${API_ROUTE}/populate`);
}

/* Uses the data in MongoDB */
export const searchAPITerm = () => {
    return chai.request(server)
        .get(API_ROUTE);
}

/* Uses data in JSON */
export const searchTerm = (term) => {
    return chai.request(server)
                .get(JSON_ROUTE)
                .query({ keyword: term });
};

/* Uses data in __mocks__ folder */
export const searchMockedTerm = (term) => {
    const regexTerm = createRegExp(term);
    return resultsFromDictionarySearch(regexTerm, term, mockedData);
};