import chai from 'chai';
import { forIn, isEqual } from 'lodash';
import {
  suggestNewExample,
  updateExampleSuggestion,
} from './shared/commands';
import {
  exampleSuggestionData,
  malformedExampleSuggestionData,
  updatedExampleSuggestionData,
} from './__mocks__/suggestions';

const { expect } = chai;
describe('MongoDB Example Suggestions', () => {
  describe('/POST mongodb exampleSuggestions', () => {
    it('should save submitted example suggestion', (done) => {
      suggestNewExample(exampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.not.equal(undefined);
          done();
        });
    });

    it('should return a word error because of malformed data', (done) => {
      suggestNewExample(malformedExampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/PUT mongodb exampleSuggestions', () => {
    it('should update specific exampleSuggestion with provided data', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          updatedExampleSuggestionData.id = res.body.id;
          updateExampleSuggestion(updatedExampleSuggestionData)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              forIn(updatedExampleSuggestionData, (value, key) => {
                expect(isEqual(result.body[key].toString(), value.toString())).to.equal(true);
              });
              done();
            });
        });
    });

    it('should return an example error because of malformed data', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          updatedExampleSuggestionData.id = res.body.id;
          updateExampleSuggestion(malformedExampleSuggestionData)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              done();
            });
        });
    });
  });
});
