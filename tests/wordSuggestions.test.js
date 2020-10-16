import chai from 'chai';
import {
  forEach,
  forIn,
  isEqual,
} from 'lodash';
import {
  suggestNewWord,
  updateWordSuggestion,
  getWordSuggestions,
  getWordSuggestion,
} from './shared/commands';
import {
  wordSuggestionData,
  malformedWordSuggestionData,
  updatedWordSuggestionData,
} from './__mocks__/suggestions';
import { LONG_TIMEOUT } from './shared/constants';
import expectUniqSetsOfResponses from './shared/utils';

const { expect } = chai;

const WORD_SUGGESTION_KEYS = [
  'originalWordId',
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

describe('MongoDB Word Suggestions', () => {
  describe('/POST mongodb wordSuggestions', () => {
    it('should save submitted word suggestion', (done) => {
      suggestNewWord(wordSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.not.equal(undefined);
          done();
        });
    });

    it('should return a word error because of malformed data', (done) => {
      suggestNewWord(malformedWordSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return a word error because invalid id', (done) => {
      const malformedData = { ...wordSuggestionData, originalWordId: 'ok123' };
      suggestNewWord(malformedData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/PUT mongodb wordSuggestions', () => {
    it('should update specific wordSuggestion with provided data', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          updatedWordSuggestionData.id = res.body.id;
          updateWordSuggestion(updatedWordSuggestionData)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              forIn(updatedWordSuggestionData, (value, key) => {
                expect(isEqual(result.body[key], value)).to.equal(true);
              });
              done();
            });
        });
    });

    it('should return an example error because of malformed data', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          updateWordSuggestion(malformedWordSuggestionData)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              done();
            });
        });
    });
  });

  describe('/GET mongodb wordSuggestions', () => {
    it('should return an example by searching', (done) => {
      const keyword = wordSuggestionData.word;
      suggestNewWord(wordSuggestionData)
        .then(() => {
          getWordSuggestions({ keyword })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf.at.least(1);
              expect(res.body[0].word).to.equal(keyword);
              done();
            });
        });
    });

    it('should return all word suggestions', (done) => {
      Promise.all([suggestNewWord(wordSuggestionData), suggestNewWord(wordSuggestionData)])
        .then(() => {
          getWordSuggestions()
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.lengthOf.at.least(5);
              forEach(res.body, (wordSuggestion) => {
                expect(wordSuggestion).to.have.all.keys(WORD_SUGGESTION_KEYS);
              });
              done();
            });
        });
    });

    it('should return one word suggestion', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          getWordSuggestion(res.body.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(result.body).to.have.all.keys(WORD_SUGGESTION_KEYS);
              done();
            });
        });
    });

    it('should return at most ten word suggestions per request with range query', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all([
        getWordSuggestions({ range: '[0,9]' }),
        getWordSuggestions({ range: '[10,19]' }),
        getWordSuggestions({ range: '[20,29' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of word suggestions for pagination', (done) => {
      Promise.all([
        getWordSuggestions(0),
        getWordSuggestions(1),
        getWordSuggestions(2),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize page over range', (done) => {
      Promise.all([
        getWordSuggestions({ page: '1' }),
        getWordSuggestions({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(true);
        done();
      });
    });
  });
});
