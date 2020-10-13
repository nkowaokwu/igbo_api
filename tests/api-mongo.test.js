import chai from 'chai';
import mongoose from 'mongoose';
import {
  forEach,
  isEqual,
  difference,
  uniqBy,
  map,
  some,
  every,
  times,
} from 'lodash';
import stringSimilarity from 'string-similarity';
import Word from '../src/models/Word';
import { LONG_TIMEOUT } from './shared/constants';
import { populateAPI, searchAPIByWord } from './shared/commands';
import createRegExp from '../src/shared/utils/createRegExp';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

const WORD_KEYS = ['variations', 'definitions', 'stems', 'examples', 'id', 'normalized', 'word', 'wordClass'];
const EXAMPLE_KEYS = ['igbo', 'english', 'associatedWords', 'id'];
const EXCLUDE_KEYS = ['__v', '_id'];

describe('MongoDB Database', () => {
  before(function (done) {
    this.timeout(LONG_TIMEOUT);
    populateAPI().then(() => {
      setTimeout(done, 20000);
    });
  });

  describe('mongodb collection', function () {
    this.timeout(LONG_TIMEOUT);
    it('should populate mongodb with words', (done) => {
      const wordData = {
        word: 'word',
        wordClass: 'noun',
        definitions: ['first definition', 'second definition'],
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
      };
      const validWord = new Word(wordData);
      validWord.save().then((savedWord) => {
        expect(savedWord.id).to.not.equal(undefined);
        expect(savedWord.word).to.equal('word');
        expect(savedWord.wordClass).to.equal('noun');
        done();
      });
    });

    it('should throw an error for invalid data', (done) => {
      const wordData = {
        word: 'word',
        wordClass: 'n.',
        definitions: ['first definition', 'second definition'],
        examples: ['first example'],
        stems: [],
      };
      const validWord = new Word(wordData);
      validWord.save().catch((err) => {
        expect(err).to.not.equal(undefined);
        done();
      });
    });
  });

  describe('/GET mongodb words', () => {
    it('should return word information', (done) => {
      const keyword = 'bia';
      searchAPIByWord({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf.at.least(2);
        forEach(res.body, (word) => {
          expect(word).to.have.all.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return at most ten words per request due to pagination', function (done) {
      this.timeout(LONG_TIMEOUT);
      Promise.all(times(5, (index) => (
        searchAPIByWord({ page: index }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf.at.least(10);
          return map(res.body, (word) => word.id);
        })
      ))).then((responses) => {
        forEach(responses, (response, index) => {
          if (index !== 0) {
            const prevResponse = responses[index - 1];
            const smallerLength = response.length <= prevResponse.length ? responses.length : prevResponse.length;
            expect(difference(prevResponse, response).length).to.be.at.least(smallerLength);
          }
        });
        done();
      });
    });

    it('should return only ten words', (done) => {
      const keyword = 'woman';
      searchAPIByWord({ keyword }).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(10);
        done();
      });
    });

    it('should handle invalid page number', (done) => {
      const keyword = 'woman';
      Promise.all([
        searchAPIByWord({ keyword, page: -1 }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(0);
        }),
        searchAPIByWord({ keyword, page: 'fake' }).then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.lengthOf(10);
        }),
      ]).then(() => (
        done()
      ));
    });

    it("should return nothing because it's an incomplete word", (done) => {
      const keyword = 'ak';
      searchAPIByWord({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(0);
        done();
      });
    });

    it('should return loose matches without accent marks', (done) => {
      const keyword = 'akikà';
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].word).to.equal('anụ');
        done();
      });
    });

    it('should return igbo words when given english with a partial match', (done) => {
      const keyword = 'animal';
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
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
      searchAPIByWord({ keyword }).end((_, res) => {
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
  });
});
