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

const { ObjectId } = mongoose.Types;

describe('MongoDB Words', () => {
  describe('mongodb collection', () => {
    it('should populate mongodb with words', async () => {
      const word = {
        word: 'word',
        wordClass: 'NNC',
        definitions: ['first definition', 'second definition'],
        dialects: {},
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
        tenses: {},
      };
      const validWord = new Word(word);
      const savedWord = await validWord.save();
      expect(savedWord.id).not.toEqual(undefined);
      expect(savedWord.word).toEqual('word');
      expect(savedWord.wordClass).toEqual('NNC');
      expect(savedWord.dialects).not.toEqual(undefined);
      expect(savedWord.tenses).not.toEqual(undefined);
    });

    it('should fail populate mongodb with incorrect variations', async () => {
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
      await validWord.save()
        .catch((err) => {
          expect(err.message.includes('`dialects`')).toEqual(true);
        });
    });

    it('should throw an error for invalid data', async () => {
      const word = {
        wordClass: 'n.',
        definitions: ['first definition', 'second definition'],
        examples: ['first example'],
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save()
        .catch((err) => {
          expect(err).not.toEqual(undefined);
        });
    });
  });

  describe('/GET mongodb words', () => {
    it('should return word information', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
        });
      });
    });

    it('should return back word information by searching definition', async () => {
      const keyword = 'smallpox';
      const words = ['kịtịkpā', 'ùlì', 'ajō ọfịa'];
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it('should return back \'king\' documents', async () => {
      const keyword = 'king';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return back \'kings\' (plural) documents', async () => {
      const keyword = 'kings';
      const words = [
        'ùfìè ',
        'Udō',
        'òbi',
        'enu igwē nà ùwà',
        '-chi',
        'igwē',
        'àbànì',
        'oke ọnū',
        'ọbā',
        'ime ōbi',
      ];
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it('should return back words related to paradoxa (within paraenthesis)', async () => {
      const keyword = 'paradoxa';
      const words = [
        'òkwùma',
        'osisi',
      ];
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it('should return back ada without Adaeze', async () => {
      const keyword = 'ada';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return back Adaeze without ada', async () => {
      const keyword = 'adaeze';
      const words = ['àda èzè', 'Àdaèzè'];
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it('should return gbā ọ̄sọ̄ by searching \'run\'', async () => {
      const keyword = 'run';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return word information with dialects query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, dialects: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.dialects).not.toEqual(undefined);
      });
    });

    it('should return word information without dialects with malformed dialects query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, dialects: 'fdsafds' });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.dialects).toEqual(undefined);
      });
    });

    it('should return word information with examples query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, examples: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.examples.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return word information without examples with malformed examples query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, examples: 'fdsafds' });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.examples).toEqual(undefined);
      });
    });

    it('should return word information with the filter query', async () => {
      const filter = 'bia';
      const res = await getWords({ filter: { word: filter } });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
        });
      });
    });

    it('should return one word', async () => {
      const res = await getWords({}, { apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      const result = await getWord(res.body[0].id);
      expect(result.status).toEqual(200);
      Object.keys(result.body).forEach((key) => {
        expect(WORD_KEYS).toContain(key);
      });
    });

    it('should return an error for incorrect word id', async () => {
      const res = await getWords();
      expect(res.status).toEqual(200);
      const result = await getWord(NONEXISTENT_ID);
      expect(result.status).toEqual(404);
      expect(result.error).not.toEqual(undefined);
    });

    it('should return an error because document doesn\'t exist', async () => {
      const res = await getWord(INVALID_ID);
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return at most twenty five words per request with range query', async () => {
      const res = await Promise.all([
        getWords({ range: true }),
        getWords({ range: '[10,34]' }),
        getWords({ range: '[35,59]' }),
      ]);
      expectUniqSetsOfResponses(res, 25);
    });

    it('should return at most four words per request with range query', async () => {
      const res = await getWords({ range: '[5,8]' });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(4);
    });

    it('should return at most ten words because of a large range', async () => {
      const res = await getWords({ range: '[10,40]' });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return at most ten words because of a tiny range', async () => {
      const res = await getWords({ range: '[10,9]' });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return at most ten words because of an invalid range', async () => {
      const res = await getWords({ range: 'incorrect' });
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return at most ten words per request with range query', async () => {
      const res = await Promise.all([
        getWords({ range: true }),
        getWords({ range: '[10,19]' }),
        getWords({ range: '[20,29]' }),
        getWords({ range: [30, 39] }),
      ]);
      expectUniqSetsOfResponses(res);
    });

    it('should return at most ten words per request due to pagination', async () => {
      const res = await Promise.all([
        getWords(),
        getWords({ page: '1' }),
        getWords({ page: '2' }),
      ]);
      expectUniqSetsOfResponses(res);
    });

    it('should return ignore case', async () => {
      const lowerCase = 'tree';
      const upperCase = 'Tree';
      const res = await Promise.all([
        getWords({ keyword: lowerCase }),
        getWords({ keyword: upperCase }),
      ]);
      expect(res[1].body.length).toBeGreaterThanOrEqual(res[0].body.length);
    });

    it('should return only ten words', async () => {
      const keyword = 'woman';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return only ten words with the filter query', async () => {
      const filter = 'woman';
      const res = await getWords({ filter: { word: filter } });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should throw an error due to negative page number', async () => {
      const keyword = 'woman';
      const res = await getWords({ keyword, page: -1 });
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should throw an error due to invalid page number', async () => {
      const filter = 'woman';
      const res = await getWords({ filter: { word: filter }, page: 'fake' });
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it.skip("should return nothing because it's an incomplete word", async () => {
      const keyword = 'ak';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(1);
    });

    it('should return igbo words when given english with an exact match', async () => {
      const keyword = 'animal; meat';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].word).toEqual('anụ');
    });

    it('should return igbo words when given english with a partial match', async () => {
      const keyword = 'animal';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
        });
      });
    });

    it('should return igbo word by searching variation', async () => {
      const keyword = 'mili';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(7);
      expect(uniqBy(res.body, (word) => word.id).length).toEqual(res.body.length);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
        });
      });
    });

    it('should return multiple word objects by searching variation', async () => {
      const keyword = '-mu-mù';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
      expect(res.body[0].word).toEqual('-mụ-mù');
      expect(some(res.body, (word) => isEqual(word.variations, ['-mu-mù']))).toEqual(true);
    });

    it('should return unique words when searching for term', async () => {
      const keyword = 'ànùnù';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(5);
      expect(uniqBy(res.body, (word) => word.id).length).toEqual(res.body.length);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
        });
      });
    });

    it('should not include _id and __v keys', async () => {
      const keyword = 'elephant';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
      expect(every(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS).toContain(key);
          expect(EXCLUDE_KEYS).not.toContain(key);
        });

        expect(every(word.examples, (example) => {
          Object.keys(example).forEach((key) => {
            expect(EXAMPLE_KEYS).toContain(key);
            expect(EXCLUDE_KEYS).not.toContain(key);
          });
        }));
      }));
    });

    it.skip('should return a sorted list of igbo terms when using english', async () => {
      const keyword = 'water';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
      expect(every(res.body, (word, index) => {
        if (index === 0) {
          return true;
        }
        const prevWord = res.body[index - 1].definitions[0] || '';
        const currentWord = word.definitions[0] || '';
        const prevWordDifference = stringSimilarity.compareTwoStrings(keyword, diacriticless(prevWord)) * 100;
        const nextWordDifference = stringSimilarity.compareTwoStrings(keyword, diacriticless(currentWord)) * 100;
        return prevWordDifference >= nextWordDifference;
      })).toEqual(true);
    });

    it('should return a list of igbo terms when using english by using single quotes', async () => {
      const keyword = '\'water\'';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should also return a list of igbo terms when using english by using double quotes', async () => {
      const keyword = '"water"';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should not return any words when wrapping an igbo word in quotes', async () => {
      const keyword = '"nkanka"';
      const res = await getWords({ keyword });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return a descending sorted list of words with sort query', async () => {
      const key = 'word';
      const direction = SortingDirections.DESCENDING;
      const res = await getWords({ sort: `["${key}", "${direction}"]` });
      expect(res.status).toEqual(200);
      expectArrayIsInOrder(res.body, key, direction);
    });

    it('should return an ascending sorted list of words with sort query', async () => {
      const key = 'definitions';
      const direction = SortingDirections.ASCENDING;
      const res = await getWords({ sort: `["${key}", "${direction}"]` });
      expect(res.status).toEqual(200);
      expectArrayIsInOrder(res.body, key, direction);
    });

    it('should throw an error due to malformed sort query', async () => {
      const key = 'wordClass';
      const res = await getWords({ sort: `["${key}]` });
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return words with no keyword as an application using MAIN_KEY', async () => {
      const res = await getWords({ apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return no words with no keyword as a developer', async () => {
      const res = await getWords();
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return accented word', async () => {
      const res = await getWords();
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => {
        expect(word.word).not.toEqual(undefined);
      });
    });

    it('should return hard matched words with strict query', async () => {
      const keyword = 'akwa';
      const res = await getWords({ keyword, strict: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      forEach(res.body, (word) => {
        const { wordReg: wordRegex } = createRegExp(word.word);
        expect(word.word).toMatch(wordRegex);
        expect(word.word.normalize('NFC').length).toEqual(keyword.normalize('NFC').length);
      });
    });

    it('should return loosely matched words without strict query', async () => {
      const keyword = 'akwa';
      const res = await getWords({ keyword, strict: false });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      forEach(res.body, (word) => {
        const { wordReg: wordRegex } = createRegExp(word.word);
        expect(word.word).toMatch(wordRegex);
      });
    });

    it('should return a word by searching with nested dialect word', async () => {
      const keyword = 'akwa-dialect';
      const res = await getWords({ keyword, dialects: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (word) => {
        expect(word.dialects[`${word.word}-dialect`]).not.toEqual(undefined);
      });
    });

    it('should return a word marked as isStandardIgbo', async () => {
      const word = {
        word: 'standardIgboWord',
        wordClass: 'NNC',
        definitions: ['first definition', 'second definition'],
        dialects: {},
        examples: [new ObjectId(), new ObjectId()],
        attributes: {
          isStandardIgbo: true,
        },
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save();
      const res = await getWords({ keyword: word.word, isStandardIgbo: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (wordRes) => {
        expect(wordRes.attributes.isStandardIgbo).toEqual(true);
      });
      const noRes = await getWords({ keyword: word.word, pronunciation: true });
      expect(noRes.status).toEqual(200);
      expect(noRes.body).toHaveLength(0);
    });

    it('should return a word marked with nsibidi', async () => {
      const word = {
        word: 'nsibidi',
        wordClass: 'NNC',
        definitions: ['first definition', 'second definition'],
        dialects: {},
        examples: [new ObjectId(), new ObjectId()],
        nsibidi: 'nsibidi',
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save();
      const res = await getWords({ keyword: word.word, nsibidi: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (wordRes) => {
        expect(wordRes.nsibidi).not.toEqual(undefined);
      });
      const noRes = await getWords({ keyword: word.word, isStandardIgbo: true });
      expect(noRes.status).toEqual(200);
      expect(noRes.body).toHaveLength(0);
    });

    it('should return a word marked with nsibidi', async () => {
      const word = {
        word: 'pronunciation',
        wordClass: 'NNC',
        definitions: ['first definition', 'second definition'],
        dialects: {},
        examples: [new ObjectId(), new ObjectId()],
        pronunciation: 'audio-pronunciation',
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save();
      const res = await getWords({ keyword: word.word, pronunciation: true });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (wordRes) => {
        expect(wordRes.pronunciation.length).toBeGreaterThanOrEqual(10);
      });
      const noRes = await getWords({ keyword: word.word, nsibidi: true });
      expect(noRes.status).toEqual(200);
      expect(noRes.body).toHaveLength(0);
    });
  });
});
