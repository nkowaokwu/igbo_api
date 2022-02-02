import chai from 'chai';
import mongoose from 'mongoose';
import {
  forEach,
  isEqual,
  uniqBy,
  some,
  every,
} from 'lodash';
import stringSimilarity from 'string-similarity';
import diacriticless from 'diacriticless';
import Word from '../src/models/Word';
import {
  WORD_KEYS,
  EXAMPLE_KEYS,
  EXCLUDE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
  MAIN_KEY,
} from './shared/constants';
import SortingDirections from '../src/shared/constants/sortingDirections';
import { getWords, getWord } from './shared/commands';
import { expectUniqSetsOfResponses, expectArrayIsInOrder } from './shared/utils';
import createRegExp from '../src/shared/utils/createRegExp';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

describe('MongoDB Words', () => {
  describe('mongodb collection', () => {
    it('should populate mongodb with words', (done) => {
      const word = {
        word: 'word',
        wordClass: 'NNC',
        definitions: ['first definition', 'second definition'],
        dialects: {},
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
      };
      const validWord = new Word(word);
      validWord.save()
        .then((savedWord) => {
          expect(savedWord.id).to.not.equal(undefined);
          expect(savedWord.word).to.equal('word');
          expect(savedWord.wordClass).to.equal('NNC');
          expect(savedWord.dialects).to.not.equal(undefined);
          done();
        });
    });
    it('should fail populate mongodb with incorrect variations', (done) => {
      const word = {
        word: 'word',
        wordClass: 'N',
        definitions: ['first definition', 'second definition'],
        dialects: {
          dialectalWord: {
            variations: [],
            dialects: ['mismatch'],
            pronunciation: '',
          },
        },
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
      };
      const validWord = new Word(word);
      validWord.save()
        .catch((err) => {
          expect(err.message.includes('`dialects`')).to.equal(true);
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

  describe('/GET mongodb words', () => {
    it('should return word information', (done) => {
      const keyword = 'bia';
      getWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word).to.have.all.keys(WORD_KEYS);
          });
          done();
        });
    });

    it('should return word information with dialects query', (done) => {
      const keyword = 'bia';
      getWords({ keyword, dialects: true })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word.dialects).to.not.equal(undefined);
          });
          done();
        });
    });

    it('should return word information without dialects with malformed dialects query', (done) => {
      const keyword = 'bia';
      getWords({ keyword, dialects: 'fdsafds' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word.dialects).to.equal(undefined);
          });
          done();
        });
    });

    it('should return word information with examples query', (done) => {
      const keyword = 'bia';
      getWords({ keyword, examples: true })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word.examples).to.have.lengthOf.at.least(0);
          });
          done();
        });
    });

    it('should return word information without examples with malformed examples query', (done) => {
      const keyword = 'bia';
      getWords({ keyword, examples: 'fdsafds' })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word.examples).to.equal(undefined);
          });
          done();
        });
    });

    it('should return word information with the filter query', (done) => {
      const filter = 'bia';
      getWords({ filter: { word: filter } })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(2);
          forEach(res.body, (word) => {
            expect(word).to.have.all.keys(WORD_KEYS);
          });
          done();
        });
    });

    it('should return one word', (done) => {
      getWords({}, { apiKey: MAIN_KEY })
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

    it('should return at most ten words because of an invalid range', (done) => {
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

    it('should return a list of igbo terms when using english by using single quotes', (done) => {
      const keyword = '\'water\'';
      getWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          done();
        });
    });

    it('should also return a list of igbo terms when using english by using double quotes', (done) => {
      const keyword = '"water"';
      getWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          done();
        });
    });

    it('should not return any words when wrapping an igbo word in quotes', (done) => {
      const keyword = '"mmili"';
      getWords({ keyword })
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    // TODO: Remove lingering sorting direction logic
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

    it('should return words with no keyword as an application using MAIN_KEY', (done) => {
      getWords({ apiKey: MAIN_KEY })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.most(10);
          done();
        });
    });

    it('should return no words with no keyword as a developer', (done) => {
      getWords()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return accented word', (done) => {
      getWords()
        .end((_, res) => {
          expect(res.status).to.equal(200);
          forEach(res.body, (word) => {
            expect(word.word).to.not.equal(undefined);
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

    it('should return a word by searching with nested dialect word', (done) => {
      const keyword = 'akwa-dialect';
      getWords({ keyword, dialects: true })
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          forEach(res.body, (word) => {
            expect(word.dialects[`${word.word}-dialect`]).to.not.equal(undefined);
          });
          done();
        });
    });
  });
});
