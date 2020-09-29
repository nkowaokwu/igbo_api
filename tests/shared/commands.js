import chai from 'chai';
import server from '../../server';
import { API_ROUTE } from './constants';
import { createRegExp } from '../../controllers/words';
import { resultsFromDictionarySearch } from '../../services/words';
import mockedData from '../__mocks__/data.mock.json';

export const searchTerm = (term) => {
    return chai.request(server)
                .get(API_ROUTE)
                .query({ keyword: term });
}

export const searchMockedTerm = (term) => {
    const regexTerm = createRegExp(term);
    return resultsFromDictionarySearch(regexTerm, term, mockedData);
}