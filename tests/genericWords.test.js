import chai from 'chai';
import {
  forEach,
  isEqual,
} from 'lodash';
import {
  populateGenericWordsAPI,
  getGenericWords,
  getGenericWord,
} from './shared/commands';
import { LONG_TIMEOUT } from './shared/constants';
import expectUniqSetsOfResponses from './shared/utils';

const { expect } = chai;

const GENERIC_WORD_KEYS = [
  'word',
  'wordClass',
  'definitions',
  'variations',
  'details',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];

describe('MongoDB Generic Words', () => {
  before(function (done) {
    this.timeout(LONG_TIMEOUT);
    populateGenericWordsAPI().then(() => {
      setTimeout(done, 5000);
    });
  });

  describe('/GET mongodb genericWords', () => {
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
  });
});
