import chai from 'chai';
import mongoose from 'mongoose';
import {
  forEach,
  isEqual,
  uniqBy,
  some,
  every,
} from 'lodash';
import levenshtein from 'js-levenshtein';
import Word from '../src/models/Word';
import { LONG_TIMEOUT } from './shared/constants';
import { populateAPI, searchAPITerm } from './shared/commands';
import createRegExp from '../src/shared/utils/createRegExp';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

const WORD_KEYS = ['__v', 'variations', 'definitions', 'phrases', 'examples', '_id', 'word', 'wordClass'];

describe('Database', () => {
  before(function (done) {
    this.timeout(LONG_TIMEOUT);
    populateAPI().then(() => {
      setTimeout(done, 20000);
    });
  });

  describe('/POST mongodb words', function () {
    this.timeout(LONG_TIMEOUT);
    it('should populate mongodb with words', (done) => {
      const wordData = {
        word: 'word',
        wordClass: 'n.',
        definitions: ['first definition', 'second definition'],
        examples: [new ObjectId(), new ObjectId()],
        phrases: new ObjectId(),
      };
      const validWord = new Word(wordData);
      validWord.save().then((savedWord) => {
        expect(savedWord.id).to.not.equal(undefined);
        expect(savedWord.word).to.equal('word');
        expect(savedWord.wordClass).to.equal('n.');
        done();
      });
    });

    it('should throw an error for invalid data', (done) => {
      const wordData = {
        word: 'word',
        wordClass: 'n.',
        definitions: ['first definition', 'second definition'],
        examples: ['first example'],
        phrases: new ObjectId(),
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
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf.at.least(2);
        forEach(res.body, (word) => {
          expect(word).to.have.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return all words', function (done) {
      this.timeout(10000);
      searchAPITerm().end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf.at.least(2878);
        done();
      });
    });

    it("should return nothing because it's an incomplete word", (done) => {
      const keyword = 'ak';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(0);
        done();
      });
    });

    it('should return loose matches without accent marks', (done) => {
      const keyword = 'akikà';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(3);
        forEach(res.body, (wordObject) => {
          const { word, phrases } = wordObject;
          const regex = createRegExp(word);
          const isKeywordPresent = !!word.match(regex)[0] || some(phrases, ({ phrase }) => phrase.match(regex));
          expect(isKeywordPresent).to.equal(true);
        });
        done();
      });
    });

    it('should return igbo words when given english with an exact match', (done) => {
      const keyword = 'animal; meat';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].word).to.equal('anụ');
        done();
      });
    });

    it('should return igbo words when given english with a partial match', (done) => {
      const keyword = 'animal';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(3);
        forEach(res.body, (word) => {
          expect(word).to.have.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return igbo word by searching variation', (done) => {
      const keyword = 'mili';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(4);
        // TODO: Address this line from ticket #79
        // eslint-disable-next-line no-underscore-dangle
        expect(uniqBy(res.body, (word) => word._id.toString()).length).to.equal(res.body.length);
        forEach(res.body, (word) => {
          expect(word).to.have.keys(WORD_KEYS);
        });
        expect(res.body[0].word).to.equal('mmilī');
        expect(isEqual(res.body[0].variations, ['mmilī', 'milī'])).to.equal(true);
        done();
      });
    });

    it('should return multiple word objects by searching variation', (done) => {
      const keyword = '-mu-mù';
      searchAPITerm(keyword).end((_, res) => {
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
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(4);
        // TODO: Address this line from ticket #79
        // eslint-disable-next-line no-underscore-dangle
        expect(uniqBy(res.body, (word) => word._id.toString()).length).to.equal(res.body.length);
        forEach(res.body, (word) => {
          expect(word).to.have.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return unique words when searching for phrase', (done) => {
      const keyword = 'ànùnù ebè';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(2);
        // TODO: Address this line from ticket #79
        // eslint-disable-next-line no-underscore-dangle
        expect(uniqBy(res.body, (word) => word._id.toString()).length).to.equal(res.body.length);
        forEach(res.body, (word) => {
          expect(word).to.have.keys(WORD_KEYS);
        });
        done();
      });
    });

    it('should return a sorted list of igbo terms when using english', (done) => {
      const keyword = 'elephant';
      searchAPITerm(keyword).end((_, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(5);
        expect(every(res.body, (word, index) => {
          if (index === 0) {
            return true;
          }
          const prevWordDifference = levenshtein(keyword, res.body[index - 1].definitions[0]) - 1;
          const nextWordDifference = levenshtein(keyword, word.definitions[0]) - 1;
          return prevWordDifference <= nextWordDifference;
        })).to.equal(true);
        done();
      });
    });
  });
});
