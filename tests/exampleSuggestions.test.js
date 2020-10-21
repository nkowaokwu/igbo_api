import chai from 'chai';
import {
  forEach,
  forIn,
  isEqual,
} from 'lodash';
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
} from './__mocks__/documentData';
import { LONG_TIMEOUT, EXAMPLE_SUGGESTION_KEYS, INVALID_ID } from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';

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

    it('should return an example error because of malformed data', (done) => {
      suggestNewExample(malformedExampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return an example error because of invalid associateWords ids', (done) => {
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
          updateExampleSuggestion(res.body.id, updatedExampleSuggestionData)
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
          updateExampleSuggestion(res.body.id, malformedExampleSuggestionData)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              done();
            });
        });
    });

    it('should return an error because document doesn\'t exist', (done) => {
      getExampleSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/GET mongodb exampleSuggestions', () => {
    it('should return an example suggestion by searching', (done) => {
      const exampleText = exampleSuggestionData.igbo;
      suggestNewExample(exampleSuggestionData)
        .then(() => {
          getExampleSuggestions({ keyword: exampleText })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf.at.least(1);
              forEach(Object.keys(exampleSuggestionData), (key) => {
                expect(res.body[0][key]).to.equal(exampleSuggestionData[key]);
              });
              done();
            });
        });
    });

    it('should return an example suggestion by searching with filter query', (done) => {
      const exampleText = exampleSuggestionData.igbo;
      suggestNewExample(exampleSuggestionData)
        .then(() => {
          getExampleSuggestions({ filter: { igbo: exampleText } })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf.at.least(1);
              forEach(Object.keys(exampleSuggestionData), (key) => {
                expect(res.body[0][key]).to.equal(exampleSuggestionData[key]);
              });
              done();
            });
        });
    });

    it('should return all example suggestions', (done) => {
      Promise.all([suggestNewExample(exampleSuggestionData), suggestNewExample(exampleSuggestionData)])
        .then(() => {
          getExampleSuggestions()
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.lengthOf.at.least(2);
              forEach(res.body, (exampleSuggestion) => {
                expect(exampleSuggestion).to.have.all.keys(EXAMPLE_SUGGESTION_KEYS);
              });
              done();
            });
        });
    });

    it('should return one example suggestion', (done) => {
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

    it('should return at most ten example suggestions per request with range query', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all([
        getExampleSuggestions({ range: '[0,9]' }),
        getExampleSuggestions({ range: '[10,19]' }),
        getExampleSuggestions({ range: '[20,29' }),
        getExampleSuggestions({ rnage: [30, 39] }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of example suggestions for pagination', (done) => {
      Promise.all([
        getExampleSuggestions(0),
        getExampleSuggestions(1),
        getExampleSuggestions(2),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize page over range', (done) => {
      Promise.all([
        getExampleSuggestions({ page: '1' }),
        getExampleSuggestions({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(true);
        done();
      });
    });

    it('should return a descending sorted list of example suggestions with sort query', (done) => {
      const key = 'word';
      const direction = 'desc';
      getExampleSuggestions({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return a ascending sorted list of example suggestions with sort query', (done) => {
      const key = 'definitions';
      const direction = 'asc';
      getExampleSuggestions({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return ascending sorted list of example suggestions with malformed sort query', (done) => {
      const key = 'wordClass';
      getExampleSuggestions({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key);
          done();
        });
    });
  });
});
