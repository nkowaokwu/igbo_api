import chai from 'chai';
import {
  forEach,
  forIn,
  isEqual,
} from 'lodash';
import {
  approveWordSuggestion,
  deleteWordSuggestion,
  suggestNewWord,
  updateWordSuggestion,
  getWordSuggestions,
  getWordSuggestion,
  getExampleSuggestion,
} from './shared/commands';
import {
  wordSuggestionId,
  wordSuggestionData,
  wordSuggestionApprovedData,
  malformedWordSuggestionData,
  updatedWordSuggestionData,
  wordSuggestionWithNestedExampleSuggestionData,
} from './__mocks__/documentData';
import { WORD_SUGGESTION_KEYS, INVALID_ID } from './shared/constants';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';
import SortingDirections from '../src/shared/constants/sortingDirections';

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

    it('should save submitted word suggestion with a nested example suggestion', (done) => {
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.not.equal(undefined);
          expect(res.body.examples).to.have.lengthOf(1);
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
          expect(res.body.authorId).to.not.be.oneOf([undefined, null, '']);
          updateWordSuggestion({ id: res.body.id, ...updatedWordSuggestionData })
            .end((_, result) => {
              expect(result.status).to.equal(200);
              forIn(updatedWordSuggestionData, (value, key) => {
                expect(isEqual(result.body[key], value)).to.equal(true);
              });
              expect(result.body.authorId).to.equal(res.body.authorId);
              done();
            });
        });
    });

    it('should update nested exampleSuggestion inside wordSuggestion', (done) => {
      const updatedIgbo = 'updated example igbo text';
      const updatedEnglish = 'updated example english text';
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const updatedExampleSuggestion = { ...res.body.examples[0], igbo: updatedIgbo, english: updatedEnglish };
          const updatedWordSuggestion = {
            ...wordSuggestionWithNestedExampleSuggestionData,
            examples: [updatedExampleSuggestion],
          };
          updateWordSuggestion({ id: res.body.id, ...updatedWordSuggestion })
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body.examples[0].igbo).to.equal(updatedIgbo);
              expect(result.body.examples[0].english).to.equal(updatedEnglish);
              done();
            });
        });
    });

    it('should update nested exampleSuggestion inside wordSuggestion despite invalid associatedWords', (done) => {
      const updatedIgbo = 'updated example igbo text';
      const updatedEnglish = 'updated example english text';
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const updatedExampleSuggestion = {
            ...res.body.examples[0],
            igbo: updatedIgbo,
            english: updatedEnglish,
            associateWords: [INVALID_ID],
          };
          const updatedWordSuggestion = {
            ...wordSuggestionWithNestedExampleSuggestionData,
            examples: [updatedExampleSuggestion],
          };
          updateWordSuggestion({ id: res.body.id, ...updatedWordSuggestion })
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body.examples[0].igbo).to.equal(updatedIgbo);
              expect(result.body.examples[0].english).to.equal(updatedEnglish);
              done();
            });
        });
    });

    it('should delete nested exampleSuggestion inside wordSuggestion', (done) => {
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const exampleSuggestionToDeleteId = res.body.examples[0].id;
          const updatedWordSuggestion = {
            ...wordSuggestionWithNestedExampleSuggestionData,
            examples: [],
          };
          updateWordSuggestion({ id: res.body.id, ...updatedWordSuggestion })
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.examples).to.have.lengthOf(0);
              getExampleSuggestion(exampleSuggestionToDeleteId)
                .end((_, noExampleSuggestionRes) => {
                  expect(noExampleSuggestionRes.status).to.equal(404);
                  expect(noExampleSuggestionRes.body.error).to.not.equal(undefined);
                  done();
                });
            });
        });
    });

    it('should throw an error because the nested example suggestion has an invalid id', (done) => {
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const updatedExampleSuggestion = { ...res.body.examples[0], id: INVALID_ID };
          const updatedWordSuggestion = {
            ...wordSuggestionWithNestedExampleSuggestionData,
            examples: [updatedExampleSuggestion],
          };
          updateWordSuggestion(updatedWordSuggestion)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.body.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should throw an error when new yet identical exampleSuggestion data is provided', (done) => {
      suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const duplicateExampleSuggestionsInWordSuggsetion = res.body;
          const { igbo, english } = res.body.examples[0];
          duplicateExampleSuggestionsInWordSuggsetion.examples.push({ igbo, english });
          updateWordSuggestion(duplicateExampleSuggestionsInWordSuggsetion)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.body.error).to.not.equal(undefined);
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

    it('should return an error because document doesn\'t exist', (done) => {
      getWordSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error for providing an invalid id', (done) => {
      updateWordSuggestion({ id: INVALID_ID })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should update the updatedOn field', (done) => {
      getWordSuggestions()
        .then((wordSuggestionsRes) => {
          expect(wordSuggestionsRes.status).to.equal(200);
          const wordSuggestion = wordSuggestionsRes.body[0];
          updateWordSuggestion({ ...wordSuggestion, word: 'updated' })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(Date.parse(wordSuggestion.updatedOn)).to.be.lessThan(Date.parse(res.body.updatedOn));
              done();
            });
        });
    });
  });

  describe('/GET mongodb wordSuggestions', () => {
    it('should return a word suggestion by searching', (done) => {
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

    it('should return a word suggestion by searching', (done) => {
      const filter = wordSuggestionData.word;
      suggestNewWord(wordSuggestionData)
        .then(() => {
          getWordSuggestions({ filter: { word: filter } })
            .end((_, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf.at.least(1);
              expect(res.body[0].word).to.equal(filter);
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

    it('should be sorted by number of approvals', (done) => {
      Promise.all([
        suggestNewWord(wordSuggestionData),
        suggestNewWord(wordSuggestionApprovedData),
      ]).then((wordSuggestionsRes) => {
        approveWordSuggestion(wordSuggestionsRes[0].body)
          .then(() => {
            getWordSuggestions()
              .end((_, res) => {
                expect(res.status).to.equal(200);
                expectArrayIsInOrder(res.body, 'approvals', SortingDirections.DESCENDING);
                done();
              });
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

    it('should return at most twenty five word suggestions per request with range query', (done) => {
      Promise.all([
        getWordSuggestions({ range: true }),
        getWordSuggestions({ range: '[10,34]' }),
        getWordSuggestions({ range: '[35,59]' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res, 25);
        done();
      });
    });

    it('should return at most four word suggestions per request with range query', (done) => {
      getWordSuggestions({ range: '[5,8]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(4);
          done();
        });
    });

    it('should return at most ten word suggestions because of a large range', (done) => {
      getWordSuggestions({ range: '[10,40]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return at most ten word suggestions because of a tiny range', (done) => {
      getWordSuggestions({ range: '[10,9]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should throw an error due to an invalid range', (done) => {
      getWordSuggestions({ range: 'incorrect' })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return at most ten word suggestions per request with range query', (done) => {
      Promise.all([
        getWordSuggestions({ range: '[0,9]' }),
        getWordSuggestions({ range: '[10,19]' }),
        getWordSuggestions({ range: '[20,29]' }),
        getWordSuggestions({ range: [30, 39] }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return different sets of word suggestions for pagination', (done) => {
      Promise.all([
        getWordSuggestions({ page: 0 }),
        getWordSuggestions({ page: 1 }),
        getWordSuggestions({ page: 2 }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return prioritize range over page', (done) => {
      Promise.all([
        getWordSuggestions({ page: '1' }),
        getWordSuggestions({ page: '1', range: '[100,109]' }),
      ]).then((res) => {
        expect(isEqual(res[0].body, res[1].body)).to.equal(false);
        done();
      });
    });

    it('should return a descending sorted list of word suggestions with sort query', (done) => {
      const key = 'word';
      const direction = SortingDirections.DESCENDING;
      getWordSuggestions({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return an ascending sorted list of word suggestions with sort query', (done) => {
      const key = 'definitions';
      const direction = SortingDirections.ASCENDING;
      getWordSuggestions({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should throw an error due to malformed sort query', (done) => {
      const key = 'wordClass';
      getWordSuggestions({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error for providing an invalid id', (done) => {
      getWordSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('/DELETE mongodb wordSuggestions', () => {
    it('should delete a single word suggestion', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          deleteWordSuggestion(res.body.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getWordSuggestion(result.body.id)
                .end((_, resError) => {
                  expect(resError.status).to.equal(404);
                  expect(resError.body.error).to.not.equal(undefined);
                  done();
                });
            });
        });
    });

    it('should return an error for attempting to deleting a non-existing word suggestion', (done) => {
      deleteWordSuggestion(INVALID_ID)
        .then((deleteRes) => {
          expect(deleteRes.status).to.equal(400);
          done();
        });
    });

    it('should return error for non existent word suggestion', (done) => {
      getWordSuggestion(wordSuggestionId)
        .end((_, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error for providing an invalid id', (done) => {
      deleteWordSuggestion(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });
  });
});
