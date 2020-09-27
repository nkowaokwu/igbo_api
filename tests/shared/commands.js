import chai from 'chai';
import server from '../../server';
import { API_ROUTE } from './constants';

export const searchTerm = (term) => {
    return chai.request(server)
                .get(API_ROUTE)
                .query({ keyword: term })
}