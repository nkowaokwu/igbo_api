import chai from 'chai';
import { forEach, forIn, isEqual } from 'lodash';
import {
  suggestNewExample,
  updateExampleSuggestion,
  getExampleSuggestions,
  getExampleSuggestion,
} from './shared/commands';
import {
  exampleSuggestionData,
  malformedExampleSuggestionData,
  updatedExampleSuggestionData,
} from './__mocks__/suggestions';

const { expect } = chai;

const EXAMPLE_SUGGESTION_KEYS = [
  'igbo',
  'english',
  'associatedWords',
  'details',
  'approvals',
  'denials',
  'updatedOn',
  'merged',
  'id',
];

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

    it('should return an example error because of malformed data', (done) => {
      suggestNewExample(malformedExampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it.only('should return an example error because of invalid associateWords ids', (done) => {
      const malformedData = {
        ...updatedExampleSuggestionData,
        associatedWords: [...updatedExampleSuggestionData.associatedWords, 'okokok'],
      };
      suggestNewExample(malformedData)
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

  describe('/GET mongodb exampleSuggestions', () => {
    it.only('should return all example suggestions', (done) => {
      Promise.all([suggestNewExample(exampleSuggestionData), suggestNewExample(exampleSuggestionData)])
        .then(() => {
          getExampleSuggestions()
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.lengthOf(2);
              forEach(res.body, (exampleSuggestion) => {
                expect(exampleSuggestion).to.have.all.keys(EXAMPLE_SUGGESTION_KEYS);
              });
              done();
            });
        });
    });

    it.only('should return one example suggestion', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          getExampleSuggestion(res.body.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(result.body).to.have.all.keys(EXAMPLE_SUGGESTION_KEYS);
              done();
            });
        });
    });
  });
});
