import chai from 'chai';
import { forIn, forEach, isEqual } from 'lodash';
import {
  populateGenericWordsAPI,
  getGenericWords,
  getGenericWord,
  updateGenericWord,
} from './shared/commands';
import {
  LONG_TIMEOUT,
  GENERIC_WORD_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
} from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';
import { malformedGenericWordData, updatedGenericWordData } from './__mocks__/documentData';

const { expect } = chai;

describe('MongoDB Generic Words', () => {
  before(function (done) {
    this.timeout(LONG_TIMEOUT);
    populateGenericWordsAPI().then(() => {
      setTimeout(done, 5000);
    });
  });

  describe('/PUT mongodb genericWords', () => {
    it('should update specific genericWord with provided data', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          updateGenericWord(res.body[0].id, updatedGenericWordData)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              forIn(updatedGenericWordData, (value, key) => {
                expect(isEqual(result.body[key].toString(), value.toString())).to.equal(true);
              });
              done();
            });
        });
    });

    it('should return a generic word error because of malformed data', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          updateGenericWord(res.body.id, malformedGenericWordData)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              done();
            });
        });
    });

    it('should return a generic word because document doesn\'t exist', (done) => {
      getGenericWord(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/GET mongodb genericWords', () => {
    it('should return a generic word by searching', (done) => {
      const keyword = 'mbughari';
      getGenericWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body[0].word).to.equal(keyword);
          done();
        });
    });

    it('should return all generic words', (done) => {
      getGenericWords()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(10);
          forEach(res.body, (genericWords) => {
            expect(genericWords).to.have.all.keys(GENERIC_WORD_KEYS);
          });
          done();
        });
    });

    it('should return a single generic word', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstGenericWord = res.body[0];
          getGenericWord(firstGenericWord.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(isEqual(result.body, firstGenericWord)).to.equal(true);
              done();
            });
        });
    });

    it('should return an error for incorrect word id', (done) => {
      getGenericWords()
        .then(() => {
          getGenericWord(NONEXISTENT_ID)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should return an error because document doesn\'t exist', (done) => {
      getGenericWord(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return different sets of generic words for pagination', (done) => {
      Promise.all([
        getGenericWords({ range: '[0,9]' }),
        getGenericWords({ range: '[10,19]' }),
        getGenericWords({ range: '[20,29' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of generic words for pagination', (done) => {
      Promise.all([
        getGenericWords(0),
        getGenericWords(1),
        getGenericWords(2),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize page over range', (done) => {
      Promise.all([
        getGenericWords({ page: '1' }),
        getGenericWords({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(true);
        done();
      });
    });

    it('should return a descending sorted list of generic words with sort query', (done) => {
      const key = 'word';
      const direction = 'desc';
      getGenericWords({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return a ascending sorted list of generic words with sort query', (done) => {
      const key = 'definitions';
      const direction = 'asc';
      getGenericWords({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return ascending sorted list of generic words with malformed sort query', (done) => {
      const key = 'wordClass';
      getGenericWords({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key);
          done();
        });
    });
  });
});
