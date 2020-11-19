import chai from 'chai';
import { forEach, every, isEqual } from 'lodash';
import {
  suggestNewExample,
  updateExampleSuggestion,
  getExampleSuggestions,
  getExampleSuggestion,
  deleteExampleSuggestion,
  suggestNewWord,
  createWord,
  getWords,
} from './shared/commands';
import {
  wordSuggestionData,
  exampleSuggestionData,
  exampleSuggestionApprovedData,
  malformedExampleSuggestionData,
  updatedExampleSuggestionData,
  wordSuggestionWithNestedExampleSuggestionData,
} from './__mocks__/documentData';
import { EXAMPLE_SUGGESTION_KEYS, INVALID_ID } from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';
import SortingDirections from '../src/shared/constants/sortingDirections';

const { expect } = chai;

describe('MongoDB Example Suggestions', () => {
  /* Create a base word and exampleSuggestion document */
  before((done) => {
    Promise.all([
      suggestNewWord(wordSuggestionData)
        .then((res) => createWord(res.body.id)),
      suggestNewExample(exampleSuggestionData)
        .then(() => {}),
    ])
      .then(setTimeout(() => done(), 1000));
  });
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
      const updatedIgboText = 'updated igbo text';
      getWords()
        .then((wordsRes) => {
          expect(wordsRes.status).to.equal(200);
          const word = wordsRes.body[0];
          suggestNewExample({ ...exampleSuggestionData, associatedWords: [word.id] })
            .then((res) => {
              expect(res.status).to.equal(200);
              updateExampleSuggestion(res.body.id, { ...res.body, igbo: updatedIgboText })
                .end((_, result) => {
                  expect(result.status).to.equal(200);
                  expect(result.body.igbo).to.equal(updatedIgboText);
                  done();
                });
            });
        });
    });

    it('should return an example error because of malformed data after creating and example suggestion', (done) => {
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

    it('should throw an error for providing an invalid id', (done) => {
      updateExampleSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should update the updatedOn field', (done) => {
      getExampleSuggestions()
        .then((exampleSuggestionsRes) => {
          expect(exampleSuggestionsRes.status).to.equal(200);
          const exampleSuggestion = exampleSuggestionsRes.body[0];
          updateExampleSuggestion(exampleSuggestion.id, exampleSuggestion)
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(Date.parse(exampleSuggestion.updatedOn)).to.be.lessThan(Date.parse(res.body.updatedOn));
              done();
            });
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

    it('should be sorted by number of approvals', (done) => {
      Promise.all([
        suggestNewExample(exampleSuggestionData),
        suggestNewExample(exampleSuggestionApprovedData),
      ]).then(() => {
        getExampleSuggestions()
          .end((_, res) => {
            expect(res.status).to.equal(200);
            expectArrayIsInOrder(res.body, 'approvals', SortingDirections.DESCENDING);
            done();
          });
      });
    });

    it('should return one example suggestion', (done) => {
      suggestNewExample(exampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          getExampleSuggestion(res.body.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(result.body).to.have.all.keys(EXAMPLE_SUGGESTION_KEYS);
              done();
            });
        });
    });

    it('should return at most twenty five example suggestions per request with range query', (done) => {
      Promise.all([
        getExampleSuggestions({ range: true }),
        getExampleSuggestions({ range: '[10,34]' }),
        getExampleSuggestions({ range: '[35,59]' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res, 25);
        done();
      });
    });

    it('should return at most four example suggestions per request with range query', (done) => {
      getExampleSuggestions({ range: '[5,8]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(4);
          done();
        });
    });

    it('should return at most ten example suggestions because of a large range', (done) => {
      getExampleSuggestions({ range: '[10,40]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return at most ten example suggestions because of a tiny range', (done) => {
      getExampleSuggestions({ range: '[10,9]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should throw an error due to an invalid range', (done) => {
      getExampleSuggestions({ range: 'incorrect' })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return at most ten example suggestions per request with range query', (done) => {
      Promise.all([
        getExampleSuggestions({ range: '[0,9]' }),
        getExampleSuggestions({ range: '[10,19]' }),
        getExampleSuggestions({ range: '[20,29]' }),
        getExampleSuggestions({ range: [30, 39] }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of example suggestions for pagination', (done) => {
      Promise.all([
        getExampleSuggestions({ page: 0 }),
        getExampleSuggestions({ page: 1 }),
        getExampleSuggestions({ page: 2 }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize range over page', (done) => {
      Promise.all([
        getExampleSuggestions({ page: '1' }),
        getExampleSuggestions({ page: '1', range: '[0,10]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(false);
        done();
      });
    });

    it('should return a descending sorted list of example suggestions with sort query', (done) => {
      const key = 'word';
      const direction = SortingDirections.DESCENDING;
      getExampleSuggestions({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return an ascending sorted list of example suggestions with sort query', (done) => {
      const key = 'definitions';
      const direction = SortingDirections.ASCENDING;
      getExampleSuggestions({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should throw an error due to malformed sort query', (done) => {
      const key = 'wordClass';
      getExampleSuggestions({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error due to invalid sorting ordering', (done) => {
      const key = 'igbo';
      getExampleSuggestions({ sort: `["${key}", "invalid"]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return filtered body excluding nested exampleSuggestions within wordSuggestions', (done) => {
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const wordSuggestionWord = res.body.word;
          const nestedExampleSuggestionId = res.body.examples[0].id;
          getExampleSuggestion(nestedExampleSuggestionId)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.exampleForSuggestion).to.equal(true);
              getExampleSuggestions({ keyword: wordSuggestionWord })
                .end((_, exampleSuggestionsRes) => {
                  expect(exampleSuggestionsRes.status).to.equal(200);
                  expect(every(exampleSuggestionsRes.body, (exampleSuggestion) => (
                    exampleSuggestion.id !== nestedExampleSuggestionId
                  )));
                  done();
                });
            });
        });
    });

    it('should throw an error for providing an invalid id', (done) => {
      getExampleSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/DELETE mongodb exampleSuggestions', () => {
    it('should delete an existing example suggestion', (done) => {
      getExampleSuggestions()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstExample = res.body[0];
          deleteExampleSuggestion(firstExample.id)
            .then((deleteRes) => {
              expect(deleteRes.status).to.equal(200);
              getExampleSuggestion(firstExample.id)
                .end((_, searchExampleRes) => {
                  expect(searchExampleRes.status).to.equal(400);
                  expect(searchExampleRes.body.error).to.not.equal(undefined);
                  done();
                });
            });
        });
    });

    it('should return an error for attempting to deleting a non-existing example suggestion', (done) => {
      deleteExampleSuggestion(INVALID_ID)
        .then((deleteRes) => {
          expect(deleteRes.status).to.equal(400);
          done();
        });
    });

    it('should throw an error for providing an invalid id', (done) => {
      deleteExampleSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });
});
