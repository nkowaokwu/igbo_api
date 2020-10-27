import chai from 'chai';
import chaiHttp from 'chai-http';
import { isEqual } from 'lodash';
import mongoose from 'mongoose';
import server from '../src/server';
import { NO_PROVIDED_TERM } from '../src/shared/constants/errorMessages';
import { LONG_TIMEOUT } from './shared/constants';
import {
  populateAPI,
  populateGenericWordsAPI,
  searchTerm,
} from './shared/commands';

const { expect } = chai;

chai.use(chaiHttp);

describe('JSON Dictionary', function () {
  this.timeout(LONG_TIMEOUT);
  before((done) => {
    Promise.all([
      populateAPI(),
      populateGenericWordsAPI(),
    ]).then(() => {
      setTimeout(done, 30000);
    });
  });

  describe('/GET words', () => {
    it('should return back word information', (done) => {
      const keyword = 'agụū';
      searchTerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(keyword);
        expect(res.body[keyword][0].wordClass).to.equal('noun');
        done();
      });
    });

    it('should return an error for searching no word', (done) => {
      searchTerm().end((_, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal(NO_PROVIDED_TERM);
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
      searchTerm('-mu-mù').end(async (_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body['-mụ-mù']).to.have.lengthOf(1);
        done();
      });
    });
  });
});

after(() => {
  server.clearDatabase();
  mongoose.connection.close();
  server.close();
});
