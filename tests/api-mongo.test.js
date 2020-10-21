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
import Word from '../src/models/Word';
import {
  LONG_TIMEOUT,
  WORD_KEYS,
  EXAMPLE_KEYS,
  EXCLUDE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
} from './shared/constants';
import {
  malformedWordData,
  wordSuggestionData,
  updatedWordData,
} from './__mocks__/documentData';
import {
  populateAPI,
  getWords,
  getWord,
  getWordSuggestion,
  createWord,
  updateWord,
  suggestNewWord,
} from './shared/commands';
import createRegExp from '../src/shared/utils/createRegExp';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

describe('MongoDB Words', function () {
  this.timeout(LONG_TIMEOUT);
  before((done) => {
    populateAPI().then(() => {
      setTimeout(done, 20000);
    });
  });

  describe('mongodb collection', function () {
    this.timeout(LONG_TIMEOUT);
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
        word: 'word',
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
    it('should create a new word in the database', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const mergingWordSuggestion = { ...res.body, ...wordSuggestionData };
          createWord(mergingWordSuggestion)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              getWordSuggestion(res.body.id)
                .end((_, wordRes) => {
                  expect(wordRes.status).to.equal(200);
                  expect(result.body.id).to.equal(wordRes.body.merged);
                  done();
                });
            });
        });
    });

    it('should throw an error for malformed new word data', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const malformedMergingWordSuggestion = { ...res.body, ...malformedWordData };
          createWord(malformedMergingWordSuggestion)
            .end((_, result) => {
              expect(result.status).to.equal(400);
              expect(result.body.error).to.not.equal(undefined);
              done();
            });
        });
    });

    it('should return newly created word by searching with keyword', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const mergingWordSuggestion = { ...res.body, ...wordSuggestionData };
          createWord(mergingWordSuggestion)
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
    it('should create a new word and update it', (done) => {
      suggestNewWord(wordSuggestionData)
        .then((res) => {
          const mergingWordSuggestion = { ...res.body, ...wordSuggestionData };
          createWord(mergingWordSuggestion)
            .then((result) => {
              expect(result.status).to.equal(200);
              expect(result.body.id).to.not.equal(undefined);
              updateWord(result.body.id, updatedWordData)
                .end((_, updateWordRes) => {
                  expect(updateWordRes.status).to.equal(200);
                  forIn(updatedWordData, (value, key) => {
                    expect(isEqual(updateWordRes.body[key], value)).to.equal(true);
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
        .then(() => {
          getWord(NONEXISTENT_ID)
            .end((_, result) => {
              expect(result.status).to.equal(400);
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

    it('should return at most ten words per request with range query', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all([
        getWords({ range: true }),
        getWords({ range: '[10,19]' }),
        getWords({ range: '[20,29' }),
        getWords({ range: [30, 39] }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
        done();
      });
    });

    it('should return at most ten words per request due to pagination', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all([
        getWords(),
        getWords({ page: '1' }),
        getWords({ page: '2' }),
      ]).then((res) => {
        expectUniqSetsOfResponses(res);
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

    it('should handle invalid page number', (done) => {
      const keyword = 'woman';
      Promise.all([
        getWords({ keyword, page: -1 }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
        }),
        getWords({ keyword, page: 'fake' }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(10);
        }),
      ]).then(() => (
        done()
      ));
    });

    it('should handle invalid page number with filter query', (done) => {
      const filter = 'woman';
      Promise.all([
        getWords({ filter: { word: filter }, page: -1 }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
        }),
        getWords({ filter: { word: filter }, page: 'fake' }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(10);
        }),
      ]).then(() => (
        done()
      ));
    });

    it("should return nothing because it's an incomplete word", (done) => {
      const keyword = 'ak';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(0);
        done();
      });
    });

    it('should return loose matches without accent marks', (done) => {
      const keyword = 'akikà';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(4);
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
        expect(res.body).to.have.lengthOf(2);
        expect(res.body[0].word).to.equal('-mụ-mù');
        expect(some(res.body, (word) => isEqual(word.variations, ['-mu-mù']))).to.equal(true);
        done();
      });
    });

    it('should return unique words when searching for term', (done) => {
      const keyword = 'ànùnù';
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(5);
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
      getWords({ keyword }).end((_, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(5);
        expect(every(res.body, (word, index) => {
          if (index === 0) {
            return true;
          }
          const prevWord = res.body[index - 1].definitions[0] || '';
          const currentWord = word.definitions[0] || '';
          const prevWordDifference = stringSimilarity.compareTwoStrings(keyword, prevWord) * -100;
          const nextWordDifference = stringSimilarity.compareTwoStrings(keyword, currentWord) * -100;
          return prevWordDifference <= nextWordDifference;
        })).to.equal(true);
        done();
      });
    });

    it('should return a descending sorted list of words with sort query', (done) => {
      const key = 'word';
      const direction = 'desc';
      getWords({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return a ascending sorted list of words with sort query', (done) => {
      const key = 'definitions';
      const direction = 'asc';
      getWords({ sort: `["${key}": "${direction}"]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key, direction);
          done();
        });
    });

    it('should return ascending sorted list of words with malformed sort query', (done) => {
      const key = 'wordClass';
      getWords({ sort: `["${key}]` })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expectArrayIsInOrder(res.body, key);
          done();
        });
    });
  });
});
