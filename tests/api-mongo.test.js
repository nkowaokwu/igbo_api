import chai from 'chai';
import mongoose from 'mongoose';
import {
  forEach,
  forIn,
  isEqual,
  uniqBy,
  some,
  every,
} from 'lodash';
import stringSimilarity from 'string-similarity';
import diacriticless from 'diacriticless';
import accents from 'remove-accents';
import Word from '../src/models/Word';
import {
  WORD_KEYS,
  EXAMPLE_KEYS,
  EXCLUDE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
  MESSAGE,
  INVALID_MESSAGE,
  AUTH_TOKEN,
} from './shared/constants';
import SortingDirections from '../src/shared/constants/sortingDirections';
import {
  exampleSuggestionData,
  wordSuggestionData,
  updatedWordData,
  updatedWordSuggestionData,
} from './__mocks__/documentData';
import {
  getWords,
  getWord,
  getWordSuggestion,
  getWordSuggestions,
  createWord,
  deleteWord,
  updateWord,
  suggestNewWord,
  getGenericWord,
  getGenericWords,
  updateGenericWord,
  sendSendGridEmail,
  updateWordSuggestion,
  getExample,
} from './shared/commands';
import {
  expectUniqSetsOfResponses,
  expectArrayIsInOrder,
  createWordFromSuggestion,
  createExampleFromSuggestion,
} from './shared/utils';
import createRegExp from '../src/shared/utils/createRegExp';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

describe('MongoDB Words', () => {
  /* Create a base wordSuggestion document */
  before((done) => {
    suggestNewWord(wordSuggestionData)
      .then(setTimeout(() => done(), 1000));
  });
  describe('mongodb collection', () => {
    it('should populate mongodb with words', (done) => {
      const word = {
        word: 'word',
        wordClass: 'noun',
        definitions: ['first definition', 'second definition'],
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
      };
      const validWord = new Word(word);
      validWord.save().then((savedWord) => {
        expect(savedWord.id).to.not.equal(undefined);
        expect(savedWord.word).to.equal('word');
        expect(savedWord.wordClass).to.equal('noun');
        done();
      });
    });

    it('should throw an error for invalid data', (done) => {
      const word = {
        wordClass: 'n.',
        definitions: ['first definition', 'second definition'],
        examples: ['first example'],
        stems: [],
      };
      const validWord = new Word(word);
      validWord.save().catch((err) => {
        expect(err).to.not.equal(undefined);
        done();
      });
    });
  });

  describe('/POST mongodb words', () => {
    it('should create a new word in the database by merging wordSuggestion', (done) => {
      suggestNewWord(updatedWordSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          const mergingWordSuggestion = { ...res.body, ...updatedWordSuggestionData };
          createWord(mergingWordSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              expect(result.body.authorId).to.equal(undefined);
              getWord(result.body.id)
                .then((updatedWordRes) => {
                  expect(updatedWordRes.status).to.equal(200);
                  getWordSuggestion(res.body.id)
                    .end((_, wordRes) => {
                      expect(wordRes.status).to.equal(200);
                      expect(wordRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(updatedWordRes.body.word).to.equal(wordRes.body.word);
                      expect(updatedWordRes.body.wordClass).to.equal(wordRes.body.wordClass);
                      expect(updatedWordRes.body.id).to.equal(wordRes.body.merged);
                      done();
                    });
                });
            });
        });
    });

    it('should create a new word in the database by merging genericWord', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstGenericWord = res.body[0];
          firstGenericWord.wordClass = 'something new';
          updateGenericWord(firstGenericWord)
            .then((saveMergedGenericWord) => {
              expect(saveMergedGenericWord.status).to.equal(200);
              createWord(firstGenericWord.id)
                .then((result) => {
                  expect(result.status).to.equal(200);
                  expect(result.body.id).to.not.equal(undefined);
                  getGenericWord(firstGenericWord.id)
                    .end((_, genericWordRes) => {
                      expect(genericWordRes.status).to.equal(200);
                      expect(genericWordRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(result.body.word).to.equal(genericWordRes.body.word);
                      expect(result.body.wordClass).to.equal(genericWordRes.body.wordClass);
                      expect(result.body.id).to.equal(genericWordRes.body.merged);
                      done();
                    });
                });
            });
        });
    });

    it('should throw an error from creating a new word from malformed genericWord', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstGenericWord = res.body[0];
          createWord(firstGenericWord.id)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.body.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should merge into an existing word with new wordSuggestion', function (done) {
      this.timeout(15000);
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          expect(res.status).to.equal(200);
          getWords()
            .then((wordRes) => {
              const firstWord = wordRes.body[0];
              const mergingWordSuggestion = { ...res.body, originalExampleId: firstWord.id };
              createWord(mergingWordSuggestion.id)
                .then((result) => {
                  expect(result.status).to.equal(200);
                  expect(result.body.id).to.not.equal(undefined);
                  expect(result.body.authorId).to.equal(undefined);
                  getWord(result.body.id)
                    .then((updatedWordRes) => {
                      expect(updatedWordRes.status).to.equal(200);
                      getWordSuggestion(res.body.id)
                        .end((_, updatedWordSuggestionRes) => {
                          expect(updatedWordRes.status).to.equal(200);
                          expect(updatedWordSuggestionRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                          expect(updatedWordRes.body.word).to.equal(updatedWordSuggestionRes.body.word);
                          expect(updatedWordRes.body.wordClass).to.equal(updatedWordSuggestionRes.body.wordClass);
                          expect(updatedWordRes.body.id).to.equal(updatedWordSuggestionRes.body.merged);
                          done();
                        });
                    });
                });
            });
        });
    });

    it('should merge into an existing word with existing wordSuggestion', function (done) {
      this.timeout(15000);
      getWordSuggestions()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstWordSuggestion = res.body[0];
          firstWordSuggestion.wordClass = 'wordClass';
          updateWordSuggestion(firstWordSuggestion)
            .then((updatedWordSuggestionRes) => {
              expect(updatedWordSuggestionRes.status).to.equal(200);
              createWord(updatedWordSuggestionRes.body.id)
                .then((wordRes) => {
                  expect(wordRes.status).to.equal(200);
                  expect(wordRes.body.word).to.equal(updatedWordSuggestionRes.body.word);
                  expect(wordRes.body.wordClass).to.equal(updatedWordSuggestionRes.body.wordClass);
                  getWordSuggestion(updatedWordSuggestionRes.body.id)
                    .end((_, wordSuggestionRes) => {
                      expect(wordSuggestionRes.status).to.equal(200);
                      expect(wordSuggestionRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(wordSuggestionRes.body.merged).to.equal(wordRes.body.id);
                      done();
                    });
                });
            });
        });
    });

    it('should merge into an existing word with genericWords', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstGenericWord = res.body[0];
          firstGenericWord.wordClass = 'wordClass';
          updateGenericWord(firstGenericWord)
            .then((updatedGenericWordRes) => {
              expect(updatedGenericWordRes.status).to.equal(200);
              createWord(updatedGenericWordRes.body.id)
                .then((wordRes) => {
                  expect(wordRes.status).to.equal(200);
                  expect(wordRes.body.word).to.equal(updatedGenericWordRes.body.word);
                  expect(wordRes.body.wordClass).to.equal(updatedGenericWordRes.body.wordClass);
                  getGenericWord(updatedGenericWordRes.body.id)
                    .end((_, genericWordRes) => {
                      expect(genericWordRes.status).to.equal(200);
                      expect(genericWordRes.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                      expect(genericWordRes.body.merged).to.equal(wordRes.body.id);
                      done();
                    });
                });
            });
        });
    });

    it('should throw error for merging an incomplete genericWord', (done) => {
      getGenericWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          const firstGenericWord = res.body[0];
          getWords()
            .then((wordRes) => {
              const firstWord = wordRes.body[0];
              const mergingGenericWord = {
                ...firstGenericWord,
                wordClass: 'wordClass',
                originalWordId: firstWord.id,
              };
              createWord(mergingGenericWord.id)
                .end((_, result) => {
                  expect(result.status).to.equal(400);
                  expect(result.body.error).to.not.equal(undefined);
                  done();
                });
            });
        });
    });

    it('should send an email with valid message object', (done) => {
      sendSendGridEmail(MESSAGE)
        .then(() => done());
    });

    it('should return an error with invalid message object', (done) => {
      sendSendGridEmail(INVALID_MESSAGE)
        .catch(() => done());
    });

    it('should return a newly created word after merging with just an id', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          createWord(res.body.id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body.error).to.equal(undefined);
              done();
            });
        });
    });

    it('should return newly created word by searching with keyword', function (done) {
      this.timeout(15000);
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const mergingWordSuggestion = { ...res.body, ...wordSuggestionData };
          createWord(mergingWordSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getWords({ keyword: wordSuggestionData.word })
                .end((_, wordRes) => {
                  expect(wordRes.status).to.equal(200);
                  expect(some(wordRes.body, (word) => word.word === mergingWordSuggestion.word)).to.equal(true);
                  done();
                });
            });
        });
    });
  });

  describe('/PUT mongodb words', () => {
    it('should create a new word and update it', function (done) {
      this.timeout(15000);
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const mergingWordSuggestion = { ...res.body, ...wordSuggestionData };
          createWord(mergingWordSuggestion.id)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              updateWord({ id: result.body.id, ...updatedWordData })
                .end((_, updateWordRes) => {
                  expect(updateWordRes.status).to.equal(200);
                  forIn(updatedWordData, (value, key) => {
                    expect(isEqual(updateWordRes.body[key], value)).to.equal(true);
                    expect(new Date(result.body.updatedOn))
                      .to.be.lessThan(new Date(updateWordRes.body.updatedOn));
                  });
                  done();
                });
            });
        });
    });
  });

  describe('/GET mongodb words', () => {
    it('should return word information', (done) => {
      const keyword = 'bia';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf.at.least(2);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return word information with the filter query', (done) => {
      const filter = 'bia';
      getWords({ filter: { word: filter } }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf.at.least(2);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return one word', (done) => {
      getWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          getWord(res.body[0].id)
            .end((_, result) => {
              expect(result.status).to.equal(200);
              expect(result.body).to.be.an('object');
              expect(result.body).to.have.all.keys(WORD_KEYS);
              done();
            });
        });
    });

    it('should return an error for incorrect word id', (done) => {
      getWords()
        .then((res) => {
          expect(res.status).to.equal(200);
          getWord(NONEXISTENT_ID)
            .end((_, result) => {
              expect(result.status).to.equal(404);
              expect(result.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should return an error because document doesn\'t exist', (done) => {
      getWord(INVALID_ID)
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return at most twenty five words per request with range query', (done) => {
      Promise.all([
        getWords({ range: true }),
        getWords({ range: '[10,34]' }),
        getWords({ range: '[35,59]' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res, 25);
        done();
      });
    });

    it('should return at most four words per request with range query', (done) => {
      getWords({ range: '[5,8]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(4);
          done();
        });
    });

    it('should return at most ten words because of a large range', (done) => {
      getWords({ range: '[10,40]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return at most ten words because of a tiny range', (done) => {
      getWords({ range: '[10,9]' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return at most ten words because of an invalid', (done) => {
      getWords({ range: 'incorrect' })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return at most ten words per request with range query', (done) => {
      Promise.all([
        getWords({ range: true }),
        getWords({ range: '[10,19]' }),
        getWords({ range: '[20,29]' }),
        getWords({ range: [30, 39] }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return at most ten words per request due to pagination', (done) => {
      Promise.all([
        getWords(),
        getWords({ page: '1' }),
        getWords({ page: '2' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return ignore case', (done) => {
      const lowerCase = 'tree';
      const upperCase = 'Tree';
      Promise.all([
        getWords({ keyword: lowerCase }),
        getWords({ keyword: upperCase }),
      ]).then((res) => {
        expect(res[1].body.length).to.be.at.least(res[0].body.length);
        done();
      });
    });

    it('should return only ten words', (done) => {
      const keyword = 'woman';
      getWords({ keyword }).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(10);
        done();
      });
    });

    it('should return only ten words with the filter query', (done) => {
      const filter = 'woman';
      getWords({ filter: { word: filter } }).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(10);
        done();
      });
    });

    it('should throw an error due to negative page number', (done) => {
      const keyword = 'woman';
      getWords({ keyword, page: -1 })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should throw an error due to invalid page number', (done) => {
      const filter = 'woman';
      getWords({ filter: { word: filter }, page: 'fake' })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it.skip("should return nothing because it's an incomplete word", (done) => {
      const keyword = 'ak';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.most(1);
        done();
      });
    });

    it('should return loose matches without accent marks', (done) => {
      const keyword = 'akikà';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(2);
        forEach(res.body, (wordObject) => {
          const { word } = wordObject;
          const regex = createRegExp(word);
          const isKeywordPresent = !!word.match(regex)[0];
          expect(isKeywordPresent).to.equal(true);
        });
        done();
      });
    });

    it('should return igbo words when given english with an exact match', (done) => {
      const keyword = 'animal; meat';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].word).to.equal('anụ');
        done();
      });
    });

    it('should return igbo words when given english with a partial match', (done) => {
      const keyword = 'animal';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(3);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return igbo word by searching variation', (done) => {
      const keyword = 'mili';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(7);
        expect(uniqBy(res.body, (word) => word.id).length).to.equal(res.body.length);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return multiple word objects by searching variation', (done) => {
      const keyword = '-mu-mù';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.most(10);
        expect(res.body[0].word).to.equal(accents.remove('-mụ-mù'));
        expect(some(res.body, (word) => isEqual(word.variations, ['-mu-mù']))).to.equal(true);
        done();
      });
    });

    it('should return unique words when searching for term', (done) => {
      const keyword = 'ànùnù';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.most(5);
        expect(uniqBy(res.body, (word) => word.id).length).to.equal(res.body.length);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should not include _id and __v keys', (done) => {
      const keyword = 'elephant';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(5);
        expect(every(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
          expect(word).to.not.have.any.keys(...EXCLUDE_KEYS);

          expect(every(word.examples, (example) => {
            expect(example).to.have.all.keys(EXAMPLE_KEYS);
            expect(example).to.not.have.any.keys(...EXCLUDE_KEYS);
          }));
        }));
        done();
      });
    });

    it('should return a sorted list of igbo terms when using english', (done) => {
      const keyword = 'water';
      getWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(5);
          expect(every(res.body, (word, index) => {
            if (index === 0) {
              return true;
            }
            const prevWord = res.body[index - 1].definitions[0] || '';
            const currentWord = word.definitions[0] || '';
            const prevWordDifference = stringSimilarity.compareTwoStrings(keyword, diacriticless(prevWord)) * 100;
            const nextWordDifference = stringSimilarity.compareTwoStrings(keyword, diacriticless(currentWord)) * 100;
            return prevWordDifference >= nextWordDifference;
          })).to.equal(true);
          done();
        });
    });

    it('should return a descending sorted list of words with sort query', (done) => {
      const key = 'word';
      const direction = SortingDirections.DESCENDING;
      getWords({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return an ascending sorted list of words with sort query', (done) => {
      const key = 'definitions';
      const direction = SortingDirections.ASCENDING;
      getWords({ sort: `["${key}", "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should throw an error due to malformed sort query', (done) => {
      const key = 'wordClass';
      getWords({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.equal(undefined);
          done();
        });
    });

    it('should return words with no keyword as admin', (done) => {
      getWords()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return no words with no keyword as user', (done) => {
      getWords({ token: AUTH_TOKEN.USER_AUTH_TOKEN })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return no words with no keyword as unauthed user', (done) => {
      getWords({ token: 'null' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return accented field and normalized word', (done) => {
      getWords()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          forEach(res.body, (word) => {
            expect(word.word).to.equal(accents.remove(word.word));
            expect(word.accented).to.not.equal(undefined);
          });
          done();
        });
    });

    it('should return hard matched words with strict query', (done) => {
      const keyword = 'akwa';
      getWords({ keyword, strict: true })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            const wordRegex = createRegExp(word.word);
            expect(word.word).to.match(wordRegex);
            expect(word.word.length).to.equal(keyword.length);
          });
          done();
        });
    });

    it('should return loosely matched words without strict query', (done) => {
      const keyword = 'akwa';
      getWords({ keyword, strict: false })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(4);
          forEach(res.body, (word) => {
            const wordRegex = createRegExp(word.word);
            expect(word.word).to.match(wordRegex);
          });
          done();
        });
    });
  });

  describe('/DELETE mongodb words', () => {
    it('should delete the word document and move its contents to a new word with associated examples', function (done) {
      this.timeout(15000);
      createWordFromSuggestion(updatedWordSuggestionData)
        .then((firstWord) => {
          createExampleFromSuggestion({ ...exampleSuggestionData, associatedWords: [firstWord.id] })
            .then((firstExample) => {
              createWordFromSuggestion({ ...updatedWordSuggestionData, word: 'combine into word' })
                .then((secondWord) => {
                  createExampleFromSuggestion({
                    ...exampleSuggestionData,
                    associatedWords: [firstWord.id, secondWord.id],
                  })
                    .then((secondExample) => {
                      expect(firstWord.id).to.not.be.oneOf([null, undefined, '']);
                      expect(secondWord.id).to.not.be.oneOf([null, undefined, '']);
                      deleteWord(firstWord.id, secondWord.id)
                        .then((combinedWordRes) => {
                          const { definitions, variations, stems } = combinedWordRes.body;
                          expect(combinedWordRes.status).to.equal(200);
                          expect(isEqual(definitions, uniqBy(definitions, (definition) => definition))).to.equal(true);
                          expect(isEqual(variations, uniqBy(variations, (variation) => variation))).to.equal(true);
                          expect(isEqual(stems, uniqBy(stems, (stem) => stem))).to.equal(true);
                          expect(definitions).to.have.include.members(firstWord.definitions);
                          expect(definitions).to.have.include.members(secondWord.definitions);
                          expect(variations).to.have.include.members(firstWord.variations);
                          expect(variations).to.have.include.members(secondWord.variations);
                          expect(stems).to.have.include.members(firstWord.stems);
                          expect(stems).to.have.include.members(secondWord.stems);
                          getExample(firstExample.id)
                            .then((firstExampleRes) => {
                              expect(firstExampleRes.status).to.equal(200);
                              getExample(secondExample.id)
                                .then((secondExampleRes) => {
                                  const { associatedWords: firstExampleAssociatedWords } = firstExampleRes.body;
                                  const { associatedWords: secondExampleAssociatedWords } = secondExampleRes.body;
                                  expect(secondExampleRes.status).to.equal(200);
                                  expect(firstExampleRes.body.associatedWords).to.include(combinedWordRes.body.id);
                                  expect(firstExampleRes.body.associatedWords).to.not.include(firstWord.id);
                                  expect(secondExampleRes.body.associatedWords).to.include(combinedWordRes.body.id);
                                  expect(secondExampleRes.body.associatedWords).to.not.include(firstWord.id);
                                  expect(isEqual(
                                    firstExampleAssociatedWords,
                                    uniqBy(firstExampleAssociatedWords, (associatedWord) => associatedWord),
                                  )).to.equal(true);
                                  expect(isEqual(
                                    secondExampleAssociatedWords,
                                    uniqBy(secondExampleAssociatedWords, (associatedWord) => associatedWord),
                                  )).to.equal(true);
                                  getWord(firstWord.id)
                                    .end((_, res) => {
                                      expect(res.status).to.equal(404);
                                      done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should return an error deleting a word with an invalid primary word id', (done) => {
      createWordFromSuggestion(updatedWordSuggestionData)
        .then((firstWord) => {
          expect(firstWord.id).to.not.be.oneOf([null, undefined, '']);
          deleteWord(firstWord.id, INVALID_ID)
            .end((_, combinedWordRes) => {
              expect(combinedWordRes.status).to.equal(400);
              expect(combinedWordRes.body.error).to.not.be.oneOf([undefined, null, '']);
              done();
            });
        });
    });

    it('should return an error deleting a word with an invalid secondary word id', (done) => {
      createWordFromSuggestion(updatedWordSuggestionData)
        .then((firstWord) => {
          expect(firstWord.id).to.not.be.oneOf([null, undefined, '']);
          deleteWord(INVALID_ID, firstWord.id)
            .then((combinedWordRes) => {
              expect(combinedWordRes.status).to.equal(400);
              expect(combinedWordRes.body.error).to.not.be.oneOf([null, undefined, '']);
              done();
            });
        });
    });

    it('should handle a word with a null stems field', function (done) {
      this.timeout(15000);
      getWords({ range: '[0, 24]' })
        .then((wordsRes) => {
          expect(wordsRes.status).to.equal(200);
          const wordWithNullStems = wordsRes.body[0];
          createWordFromSuggestion({ ...updatedWordSuggestionData, stems: null })
            .then((firstWord) => {
              deleteWord(firstWord.id, wordWithNullStems.id)
                .then((combinedWordRes) => {
                  const { definitions, variations, stems } = combinedWordRes.body;
                  expect(combinedWordRes.status).to.equal(200);
                  expect(isEqual(definitions, uniqBy(definitions, (definition) => definition))).to.equal(true);
                  expect(isEqual(variations, uniqBy(variations, (variation) => variation))).to.equal(true);
                  expect(isEqual(stems, uniqBy(stems, (stem) => stem))).to.equal(true);
                  expect(definitions).to.have.include.members(firstWord.definitions);
                  expect(definitions).to.have.include.members(wordWithNullStems.definitions);
                  expect(variations).to.have.include.members(firstWord.variations);
                  expect(variations).to.have.include.members(wordWithNullStems.variations);
                  expect(stems).to.have.include.members(firstWord.stems);
                  expect(stems).to.have.include.members(wordWithNullStems.stems);
                  done();
                });
            });
        });
    });

    it('should delete all wordSuggestions that are associated with the combined word', (done) => {
      createWordFromSuggestion(updatedWordSuggestionData)
        .then((word) => {
          suggestNewWord({ ...wordSuggestionData, originalWordId: word.id })
            .then((wordSuggestionRes) => {
              suggestNewWord({ ...wordSuggestionData, originalWordId: word.id })
                .then((secondWordSuggestionRes) => {
                  expect(wordSuggestionRes.status).to.equal(200);
                  createWordFromSuggestion(updatedWordSuggestionData)
                    .then((secondWord) => {
                      suggestNewWord({ ...wordSuggestionData, originalWordId: secondWord.id })
                        .then((thirdWordSuggestionRes) => {
                          deleteWord(word.id, secondWord.id)
                            .then((combinedWordRes) => {
                              expect(combinedWordRes.status).to.equal(200);
                              getWordSuggestion(wordSuggestionRes.body.id)
                                .then((firstNonExistentWordSuggestionRes) => {
                                  expect(firstNonExistentWordSuggestionRes.status).to.equal(404);
                                  getWordSuggestion(secondWordSuggestionRes.body.id)
                                    .then((secondNonExistentWordSuggestionRes) => {
                                      expect(secondNonExistentWordSuggestionRes.status).to.equal(404);
                                      getWordSuggestion(thirdWordSuggestionRes.body.id)
                                        .then((thirdExistentWordSuggestionRes) => {
                                          expect(thirdExistentWordSuggestionRes.status).to.equal(200);
                                          expect(thirdExistentWordSuggestionRes.body.id).to.not.equal(undefined);
                                          done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
  });
});
