import chai from 'chai';
import { isEqual, forIn, some } from 'lodash';
import SortingDirections from '../src/shared/constants/sortingDirections';
import {
  createExample,
  getExamples,
  getExample,
  updateExample,
  suggestNewExample,
  getExampleSuggestion,
  getExampleSuggestions,
} from './shared/commands';
import {
  AUTH_TOKEN,
  EXAMPLE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
} from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';
import {
  exampleData,
  exampleSuggestionData,
  malformedExampleSuggestionData,
  updatedExampleData,
} from './__mocks__/documentData';

const { expect } = chai;

describe('MongoDB Examples', () => {
  /* Create a baseexampleSuggestion document */
  before((done) => {
    suggestNewExample(exampleSuggestionData)
      .then(setTimeout(() => done(), 1000));
  });
  describe('/POST mongodb examples', () => {
    it('should create a new example in the database', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const mergingExampleSuggestion = { ...res.body, ...exampleSuggestionData };
          createExample(mergingExampleSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getExample(result.body.id)
                .then((updatedExampleRes) => {
                  expect(updatedExampleRes.status).to.equal(200);
                  getExampleSuggestion(res.body.id)
                    .end((_, exampleRes) => {
                      expect(exampleRes.status).to.equal(200);
                      expect(exampleRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(updatedExampleRes.body.igbo).to.equal(exampleRes.body.igbo);
                      expect(updatedExampleRes.body.english).to.equal(exampleRes.body.english);
                      expect(updatedExampleRes.body.id).to.equal(exampleRes.body.merged);
                      done();
                    });
                });
            });
        });
    });

    it('should create a new example from existing exampleSuggestion in the database', (done) => {
      getExampleSuggestions()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstExample = res.body[0];
          const mergingExampleSuggestion = { ...firstExample, ...exampleSuggestionData };
          createExample(mergingExampleSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getExample(result.body.id)
                .then((updatedExampleRes) => {
                  expect(updatedExampleRes.status).to.equal(200);
                  getExampleSuggestion(firstExample.id)
                    .end((_, exampleRes) => {
                      expect(exampleRes.status).to.equal(200);
                      expect(exampleRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(updatedExampleRes.body.igbo).to.equal(exampleRes.body.igbo);
                      expect(updatedExampleRes.body.english).to.equal(exampleRes.body.english);
                      expect(updatedExampleRes.body.id).to.equal(exampleRes.body.merged);
                      done();
                    });
                });
            });
        });
    });

    it('should merge into an existing example', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          getExamples()
            .then((examplesRes) => {
              const firstExample = examplesRes.body[0];
              const mergingExampleSuggestion = { ...res.body, originalExampleId: firstExample.id };
              createExample(mergingExampleSuggestion.id)
                .then((result) => {
                  expect(result.status).to.equal(200);
                  expect(result.body.id).to.not.equal(undefined);
                  getExample(result.body.id)
                    .then((updatedExampleRes) => {
                      expect(updatedExampleRes.status).to.equal(200);
                      getExampleSuggestion(res.body.id)
                        .end((_, exampleRes) => {
                          expect(exampleRes.status).to.equal(200);
                          expect(exampleRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                          expect(updatedExampleRes.body.igbo).to.equal(exampleRes.body.igbo);
                          expect(updatedExampleRes.body.english).to.equal(exampleRes.body.english);
                          expect(updatedExampleRes.body.id).to.equal(exampleRes.body.merged);
                          done();
                        });
                    });
                });
            });
        });
    });

    it('should merge into new example despite provided malformed data', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          const malformedMergingExampleSuggestion = { ...res.body, ...malformedExampleSuggestionData };
          createExample(malformedMergingExampleSuggestion.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body.error).to.equal(undefined);
              done();
            });
        });
    });

    it('should return newly created example by searching with keyword', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          const mergingExampleSuggestion = { ...res.body, ...exampleSuggestionData };
          createExample(mergingExampleSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getExamples({ keyword: exampleData.igbo })
                .end((_, exampleRes) => {
                  expect(exampleRes.status).to.equal(200);
                  expect(some(exampleRes.body, (example) => example.igbo === exampleData.igbo)).to.equal(true);
                  done();
                });
            });
        });
    });

    it('should return newly created example by searching with filter query', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          const mergingExampleSuggestion = { ...res.body, ...exampleSuggestionData };
          createExample(mergingExampleSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getExamples({ filter: { igbo: exampleData.igbo } })
                .end((_, exampleRes) => {
                  expect(exampleRes.status).to.equal(200);
                  expect(some(exampleRes.body, (example) => example.igbo === exampleData.igbo)).to.equal(true);
                  done();
                });
            });
        });
    });
  });

  describe('/PUT mongodb examples', () => {
    it('should create a new example and update it', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          const mergingExampleSuggestion = { ...res.body, ...exampleSuggestionData };
          createExample(mergingExampleSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              updateExample(result.body.id, updatedExampleData)
                .end((_, exampleRes) => {
                  expect(exampleRes.status).to.equal(200);
                  expect(new Date(result.body.updatedOn))
                    .to.be.lessThan(new Date(exampleRes.body.updatedOn));
                  forIn(updatedExampleData, (value, key) => {
                    expect(isEqual(exampleRes.body[key], value)).to.equal(true);
                  });
                  done();
                });
            });
        });
    });
  });

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
              expect(result.status).to.equal(400);
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
  });
});
