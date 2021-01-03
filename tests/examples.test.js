import chai from 'chai';
import { isEqual, forEach } from 'lodash';
import accents from 'remove-accents';
import SortingDirections from '../src/shared/constants/sortingDirections';
import { getExamples, getExample } from './shared/commands';
import {
  AUTH_TOKEN,
  EXAMPLE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
} from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';

const { expect } = chai;

describe('MongoDB Examples', () => {
  describe('/GET mongodb examples', () => {
    it('should return an example by searching', (done) => {
      getExamples()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return one example', (done) => {
      getExamples()
        .then((res) => {
          getExample(res.body[0].id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(result.body).to.have.all.keys(EXAMPLE_KEYS);
              done();
            });
        });
    });

    it('should return an error for incorrect example id', (done) => {
      getExamples()
        .then(() => {
          getExample(NONEXISTENT_ID)
            .end((_, result) => {
              expect(result.status).to.equal(404);
              expect(result.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should return an error because document doesn\'t exist', (done) => {
      getExample(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return at most ten example per request with range query', (done) => {
      Promise.all([
        getExamples({ range: '[0,9]' }),
        getExamples({ range: [10, 19] }),
        getExamples({ range: '[20,29]' }),
        getExamples({ range: '[30,39]' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of example suggestions for pagination', (done) => {
      Promise.all([
        getExamples({ page: 0 }),
        getExamples({ page: 1 }),
        getExamples({ page: 2 }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize range over page', (done) => {
      Promise.all([
        getExamples({ page: '1' }),
        getExamples({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(false);
        done();
      });
    });

    it('should return a descending sorted list of examples with sort query', (done) => {
      const key = 'igbo';
      const direction = SortingDirections.DESCENDING;
      getExamples({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return an ascending sorted list of examples with sort query', (done) => {
      const key = 'english';
      const direction = SortingDirections.ASCENDING;
      getExamples({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should throw an error due to malformed sort query', (done) => {
      const key = 'igbo';
      getExamples({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error due to invalid sorting ordering', (done) => {
      const key = 'igbo';
      getExamples({ sort: `["${key}", "invalid"]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return words with no keyword as admin', (done) => {
      getExamples()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return no words with no keyword as user', (done) => {
      getExamples({ token: AUTH_TOKEN.USER_AUTH_TOKEN })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return no words with no keyword as unauthed user', (done) => {
      getExamples({ token: 'null' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return accented field with keyword', (done) => {
      const keyword = 'Òbìàgèlì bì n’Àba';
      getExamples({ keyword })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          forEach(res.body, (example) => {
            expect(example.igbo).to.equal(accents.remove(keyword));
            expect(example.igbo).to.not.equal(undefined);
          });
          done();
        });
    });

    it('should return accented field and normalized example', (done) => {
      getExamples()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          forEach(res.body, (example) => {
            expect(example.igbo).to.equal(accents.remove(example.igbo));
            expect(example.igbo).to.not.equal(undefined);
          });
          done();
        });
    });
  });
});
