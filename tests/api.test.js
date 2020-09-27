import chai from 'chai';
import chaiHttp from 'chai-http';
import { isEqual } from 'lodash';
import server from '../server';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';
import { searchTerm } from './shared/commands';

process.env.NODE_ENV = 'test';
const { expect } = chai;

chai.use(chaiHttp);

describe('Words', () => {
    describe('/GET words', () => {
        it('should return back word information', (done) => {
            const keyword = 'agụū';
            searchTerm(keyword)
            .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.keys(keyword);
                done();
            });
        });

        it('should return an error for searching no word', (done) => {
            searchTerm()
            .end((_, res) => {
                expect(res.status).to.equal(400);
                expect(res.text).to.equal(NO_PROVIDED_TERM);
                done();
            });
        });

        it('should return the same term information', (done) => {
            searchTerm('ndi ndi')
            .then(async ({ status, body: normalizeData }) => {
                expect(status).to.equal(200);
                const { status: rawStatus, body: rawData } = await searchTerm('ndị ndi');
                expect(rawStatus).to.equal(200);
                expect(isEqual(normalizeData, rawData)).to.be.equal(true);
                done();
            });
        });
    });
});

after(() => server.close());