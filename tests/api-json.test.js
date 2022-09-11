import chai from 'chai';
import chaiHttp from 'chai-http';
import { isEqual, sortBy } from 'lodash';
import mongoose from 'mongoose';
import server from '../src/server';
import { NO_PROVIDED_TERM } from '../src/shared/constants/errorMessages';
import {
  populateAPI,
  searchTerm,
  getWords,
} from './shared/commands';

const { expect } = chai;

chai.use(chaiHttp);

describe('JSON Dictionary', () => {
  before(function (done) {
    this.timeout(120000);
    server.clearDatabase();
    populateAPI()
      .end(() => {
        setTimeout(() => done(), 10000);
      });
  });

  describe('/GET words', () => {
    it('should return back word information', (done) => {
      const keyword = 'agụū';
      searchTerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['(agụū) -gụ', '-gụ agụū', 'agụū mmīli', keyword]);
        expect(res.body[keyword][0].wordClass).to.equal('NNC');
        done();
      });
    });

    it('should return an error for searching no word', (done) => {
      searchTerm().end((_, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal(NO_PROVIDED_TERM);
        done();
      });
    });

    it('should return the same term information', (done) => {
      searchTerm('ndi ndi').end(async (_, { status, body: normalizeData }) => {
        expect(status).to.equal(200);
        const { status: rawStatus, body: rawData } = await searchTerm('ndị ndi');
        expect(rawStatus).to.equal(200);
        expect(isEqual(normalizeData, rawData)).to.equal(true);
        done();
      });
    });

    it('should return term using variation', (done) => {
      searchTerm('-mu-mù').end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body['-mụ-mù']).to.have.lengthOf(1);
        done();
      });
    });

    it('should return words in alphabetical order', (done) => {
      getWords().end((_, res) => {
        expect(res.status).to.equal(200);
        const resWords = res.body.map(({ word }) => word);
        const sortedWords = sortBy(resWords, [(word) => word]);
        expect(isEqual(resWords, sortedWords)).to.equal(true);
        done();
      });
    });
  });
});

after(() => {
  server.clearDatabase();
  server.close();
  console.log('📪 Closing database connection');
  setTimeout(() => {
    mongoose.connection.close();
  }, 5000);
});
