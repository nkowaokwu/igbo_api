import chai from 'chai';
import { forIn, isEqual } from 'lodash';
import {
  suggestNewWord,
  updateWordSuggestion,
} from './shared/commands';
import {
  wordSuggestionData,
  malformedWordSuggestionData,
  updatedWordSuggestionData,
} from './__mocks__/suggestions';

const { expect } = chai;

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
});
