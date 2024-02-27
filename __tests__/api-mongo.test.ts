import mongoose from 'mongoose';
import { forEach, has, isEqual, uniqBy, some, every } from 'lodash';
import stringSimilarity from 'string-similarity';
import diacriticless from 'diacriticless';
import { wordSchema } from '../src/models/Word';
import WordClass from '../src/shared/constants/WordClass';
import {
  WORD_KEYS_V1,
  WORD_KEYS_V2,
  EXAMPLE_KEYS_V1,
  EXCLUDE_KEYS,
  INVALID_ID,
  NONEXISTENT_ID,
  MAIN_KEY,
} from './shared/constants';
import { getWords, getWord, getWordsV2, getWordV2 } from './shared/commands';
import { expectUniqSetsOfResponses } from './shared/utils';
import createRegExp from '../src/shared/utils/createRegExp';
import { createDbConnection, handleCloseConnection } from '../src/services/database';
import Tenses from '../src/shared/constants/Tenses';
import { Word as WordType } from '../src/types';
import WordClassEnum from '../src/shared/constants/WordClassEnum';

const { ObjectId } = mongoose.Types;

describe('MongoDB Words', () => {
  describe('mongodb collection', () => {
    it('should populate mongodb with words', async () => {
      const connection = createDbConnection();
      const Word = connection.model('Word', wordSchema);
      const word = {
        word: 'word',
        definitions: [
          {
            wordClass: 'NNC',
            definitions: ['first definition', 'second definition'],
          },
        ],
        dialects: [
          {
            variations: [],
            dialects: ['NSA'],
            pronunciation: '',
            word: 'dialectalWord',
          },
        ],
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
        tenses: {},
      };
      const validWord = new Word(word);
      const savedWord = await validWord.save();
      await handleCloseConnection(connection);
      expect(savedWord.id).not.toEqual(undefined);
      expect(savedWord.word).toEqual('word');
      // @ts-expect-error wordClass
      expect(savedWord.definitions[0].wordClass).toEqual('NNC');
      expect(savedWord.tenses).not.toEqual(undefined);
      const wordRes = await getWord(savedWord.id, { dialects: true }, {});
      expect(wordRes.status).toEqual(200);
      expect(wordRes.body.dialects.dialectalWord).not.toEqual(undefined);
      const v2WordRes = await getWordV2(savedWord.id, { dialects: true }, {});
      expect(v2WordRes.status).toEqual(200);
      expect(v2WordRes.body.data.dialects[0].word).toEqual('dialectalWord');
    });

    it('should fail populate mongodb with incorrect variations', async () => {
      const connection = createDbConnection();
      const Word = connection.model('Word', wordSchema);
      const word = {
        word: 'word',
        definitions: [
          {
            wordClass: 'NNC',
            definitions: ['first definition', 'second definition'],
          },
        ],
        dialects: {
          variations: [],
          dialects: ['mismatch'],
          pronunciation: '',
          word: 'dialectalWord',
        },
        examples: [new ObjectId(), new ObjectId()],
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save().catch(async (err) => {
        await handleCloseConnection(connection);
        expect(err.message.includes('dialects')).toEqual(true);
      });
    });

    it('should throw an error for invalid data', async () => {
      const connection = createDbConnection();
      const Word = connection.model('Word', wordSchema);
      const word = {
        definitions: [
          {
            wordClass: 'n.',
            definitions: ['first definition', 'second definition'],
          },
        ],
        examples: ['first example'],
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save().catch(async (err) => {
        await handleCloseConnection(connection);
        expect(err).not.toEqual(undefined);
      });
    });
  });

  describe('/GET mongodb words V1', () => {
    it('should return word information', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
        });
      });
    });

    it('should return back word information by searching definition', async () => {
      const keyword = 'smallpox';
      const words = ['kịtịkpā', 'ùlì', 'ajō ọfịa'];
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it("should return back 'king' documents", async () => {
      const keyword = 'king';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it("should return back 'kings' (plural) documents", async () => {
      const keyword = 'kings';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return back words related to paradoxa (within paraenthesis)', async () => {
      const keyword = 'paradoxa';
      const words = ['òkwùma', 'osisi'];
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it('should return back ada without Adaeze', async () => {
      const keyword = 'ada';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return back Adaeze without ada', async () => {
      const keyword = 'adaeze';
      const words = ['àda èzè', 'Àdaèzè'];
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => expect(words).toContain(word.word));
    });

    it("should return gbā ọ̄sọ̄ by searching 'run'", async () => {
      const keyword = 'run';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it("should return words using stop word ('who') as search keyword", async () => {
      const keyword = 'who';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it("should return words using stop word ('what') as search keyword", async () => {
      const keyword = 'what';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return word information with dialects query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, dialects: true }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.dialects).not.toEqual(undefined);
      });
    });

    it('should return word information without dialects with malformed dialects query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, dialects: 'fdsafds' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.dialects).toEqual(undefined);
      });
    });

    it('should return word information with examples query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, examples: true }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.examples.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return word information without examples with malformed examples query', async () => {
      const keyword = 'bia';
      const res = await getWords({ keyword, examples: 'fdsafds' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        expect(word.examples).toEqual(undefined);
      });
    });

    it('should return word information with the filter query', async () => {
      const filter = 'bia';
      const res = await getWords({ filter: { word: filter } }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
        });
      });
    });

    it('should return one word', async () => {
      const res = await getWords({}, { apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      const result = await getWord(res.body[0].id, {}, {});
      expect(result.status).toEqual(200);
      Object.keys(result.body).forEach((key) => {
        expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
      });
    });

    it('should return an error for incorrect word id', async () => {
      const res = await getWords({}, {});
      expect(res.status).toEqual(200);
      const result = await getWord(NONEXISTENT_ID, {}, {});
      expect(result.status).toEqual(404);
      expect(result.error).not.toEqual(undefined);
    });

    it("should return an error because document doesn't exist", async () => {
      const res = await getWord(INVALID_ID, {}, {});
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return at most twenty five words per request with range query', async () => {
      const res = await Promise.all([
        getWords({ range: true }, {}),
        getWords({ range: '[10,34]' }, {}),
        getWords({ range: '[35,59]' }, {}),
      ]);
      expectUniqSetsOfResponses(res, 25);
    });

    it('should return at most four words per request with range query', async () => {
      const res = await getWords({ range: '[5,8]' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(4);
    });

    it('should return at most ten words because of a large range', async () => {
      const res = await getWords({ range: '[10,40]' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return at most ten words because of a tiny range', async () => {
      const res = await getWords({ range: '[10,9]' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return at most ten words because of an invalid range', async () => {
      const res = await getWords({ range: 'incorrect' }, {});
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should return at most ten words per request with range query', async () => {
      const res = await Promise.all([
        getWords({ range: true }, {}),
        getWords({ range: '[10,19]' }, {}),
        getWords({ range: '[20,29]' }, {}),
        getWords({ range: [30, 39] }, {}),
      ]);
      expectUniqSetsOfResponses(res);
    });

    it('should return at most ten words per request due to pagination', async () => {
      const res = await Promise.all([
        getWords({}, {}),
        getWords({ page: '1' }, {}),
        getWords({ page: '2' }, {}),
      ]);
      expectUniqSetsOfResponses(res);
    });

    it('should return ignore case', async () => {
      const lowerCase = 'tree';
      const upperCase = 'Tree';
      const res = await Promise.all([
        getWords({ keyword: lowerCase }, {}),
        getWords({ keyword: upperCase }, {}),
      ]);
      expect(res[1].body.length).toBeGreaterThanOrEqual(res[0].body.length);
    });

    it('should return only ten words', async () => {
      const keyword = 'woman';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should return only ten words with the filter query', async () => {
      const filter = 'woman';
      const res = await getWords({ filter: { word: filter } }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    it('should throw an error due to negative page number', async () => {
      const keyword = 'woman';
      const res = await getWords({ keyword, page: -1 }, {});
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it('should throw an error due to invalid page number', async () => {
      const filter = 'woman';
      const res = await getWords({ filter: { word: filter }, page: 'fake' }, {});
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toEqual(undefined);
    });

    it.skip("should return nothing because it's an incomplete word", async () => {
      const keyword = 'ak';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(1);
    });

    it('should return igbo words when given english with an exact match', async () => {
      const keyword = 'animal; meat';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].word).toEqual('anụ');
    });

    it('should return igbo words when given english with a partial match', async () => {
      const keyword = 'animal';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
        });
      });
    });

    it('should return igbo word by searching variation', async () => {
      const keyword = 'mili';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(2); // Expecting mmilī (variation is milī) and -mìlị
      expect(uniqBy(res.body, (word: WordType) => word.id).length).toEqual(res.body.length);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
        });
      });
    });

    it('should return multiple word objects by searching variation', async () => {
      const keyword = '-mu-mù';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
      expect(res.body[0].word).toEqual('-mụ-mù');
      expect(some(res.body, (word) => isEqual(word.variations, ['-mu-mù']))).toEqual(true);
    });

    it('should return unique words when searching for term', async () => {
      const keyword = 'ànùnù';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(5);
      expect(uniqBy(res.body, (word: WordType) => word.id).length).toEqual(res.body.length);
      forEach(res.body, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
        });
      });
    });

    it('should not include _id and __v keys', async () => {
      const keyword = 'elephant';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(
        every(res.body, (word) => {
          Object.keys(word).forEach((key) => {
            expect(WORD_KEYS_V1.includes(key)).toBeTruthy();
          });
          Object.keys(word).forEach((key) => {
            expect(EXCLUDE_KEYS).not.toContain(key);
          });

          expect(
            every(word.examples, (example) => {
              EXAMPLE_KEYS_V1.forEach((key) => {
                expect(has(word, key)).toBeTruthy();
              });
              Object.keys(example).forEach((key) => {
                expect(EXCLUDE_KEYS).not.toContain(key);
              });
            })
          );
        })
      );
    });

    it.skip('should return a sorted list of igbo terms when using english', async () => {
      const keyword = 'water';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
      const responseBody: WordType[] = res.body;
      expect(
        every(responseBody, (word, index) => {
          if (index === 0) {
            return true;
          }
          const prevWord = res.body[index - 1].definitions[0] || '';
          const currentWord = word.definitions[0] || '';
          const prevWordDifference =
            stringSimilarity.compareTwoStrings(keyword, diacriticless(prevWord)) * 100;
          const nextWordDifference =
            stringSimilarity.compareTwoStrings(keyword, diacriticless(currentWord)) * 100;
          return prevWordDifference >= nextWordDifference;
        })
      ).toEqual(true);
    });

    it('should return a list of igbo terms when using english by using single quotes', async () => {
      const keyword = "'water'";
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should also return a list of igbo terms when using english by using double quotes', async () => {
      const keyword = '"water"';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should not return any words when wrapping an igbo word in quotes', async () => {
      const keyword = '"nkanka"';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return words with no keyword as an application using MAIN_KEY', async () => {
      const res = await getWords({}, { apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeLessThanOrEqual(10);
    });

    it('should return no words with no keyword as a developer', async () => {
      const res = await getWords({}, {});
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    it('should return accented word', async () => {
      const res = await getWords({}, {});
      expect(res.status).toEqual(200);
      forEach(res.body, (word) => {
        expect(word.word).not.toEqual(undefined);
      });
    });

    it('should return hard matched words with strict query', async () => {
      const keyword = 'akwa';
      const res = await getWords({ keyword, strict: true }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (word) => {
        const { wordReg: wordRegex } = createRegExp(word.word);
        expect(word.word).toMatch(wordRegex);
      });
    });

    it('should return loosely matched words without strict query', async () => {
      const keyword = 'akwa';
      const res = await getWords({ keyword, strict: false }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      forEach(res.body, (word) => {
        const { wordReg: wordRegex } = createRegExp(word.word);
        expect(word.word).toMatch(wordRegex);
      });
    });

    it('should return a word by searching with nested dialect word', async () => {
      const keyword = 'akwa-dialect';
      const res = await getWords({ keyword, dialects: true }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (word) => {
        expect(word.dialects[`${word.word}-dialect`]).not.toEqual(undefined);
      });
    });

    it('should return a word that is a common noun', async () => {
      const connection = createDbConnection();
      const Word = connection.model('Word', wordSchema);
      const word = {
        word: 'standardIgboWord',
        definitions: [
          {
            wordClass: 'NNC',
            definitions: ['first definition', 'second definition'],
          },
        ],
        dialects: [],
        examples: [new ObjectId(), new ObjectId()],
        attributes: {
          isStandardIgbo: true,
        },
        stems: [],
      };
      const validWord = new Word(word);
      await validWord.save();
      await handleCloseConnection(connection);
      const res = await getWords({ keyword: word.word, wordClasses: '[NNC]' }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (wordRes) => {
        expect(wordRes.attributes.isStandardIgbo).toEqual(true);
      });
      const noRes = await getWords({ keyword: word.word, wordClasses: ['ADJ'] }, {});
      expect(noRes.status).toEqual(200);
      expect(noRes.body).toHaveLength(0);
    });

    it('should return all tenses', async () => {
      const keyword = 'bịa';
      const res = await getWords({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      forEach(res.body, (word) => {
        if (word.definitions[0].wordClass === WordClass.AV.value) {
          expect(word.tenses[Tenses.PRESENT_PASSIVE.value]).not.toBe(undefined);
        } else if (word.definitions[0].wordClass === WordClass.PV.value) {
          expect(word.tenses[Tenses.PRESENT_PASSIVE.value]).not.toBe(undefined);
        }
      });
    });
  });

  describe('/GET mongodb words V2', () => {
    it('should return word parts of mgba for noun deconstruction', async () => {
      const keyword = 'mgba';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      const gbaWord = res.body.data.find(({ word }: { word: string }) => word === 'gba');
      expect(gbaWord).toBeTruthy();
    });
    it('should return word information', async () => {
      const keyword = 'bia';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      forEach(res.body.data, (word) => {
        Object.keys(word).forEach((key) => {
          expect(WORD_KEYS_V2).toContain(key);
        });
        const { wordClass }: { wordClass: WordClassEnum } = word.definitions[0];
        expect(WordClass[wordClass]).not.toBe(undefined);
      });
    });
    it('should return one word', async () => {
      const res = await getWordsV2({}, { apiKey: MAIN_KEY });
      expect(res.status).toEqual(200);
      const result = await getWordV2(res.body.data[0].id, {}, {});
      expect(result.status).toEqual(200);
      Object.keys(result.body.data).forEach((key) => {
        expect(WORD_KEYS_V2.includes(key)).toBeTruthy();
      });
      const { wordClass }: { wordClass: WordClassEnum } = result.body.data.definitions[0];
      expect(WordClass[wordClass]).not.toBe(undefined);
    });
    it("should return words using stop word ('who') as search keyword", async () => {
      const keyword = 'who';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.data).toHaveLength(10);
    });
    it("should return words using stop word ('what') as search keyword", async () => {
      const keyword = 'what';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.data).toHaveLength(10);
    });
    it('should return word with verb conjugation', async () => {
      const keyword = 'ajora';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
    it('should return word parts of bịara for verb deconstruction', async () => {
      const keyword = 'bịara';
      const res = await getWordsV2({ keyword }, {});
      expect(res.status).toEqual(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
    it('should noun with broken portions or word', async () => {
      const keyword = 'ọrụ';
      const res = await getWordsV2({ keyword }, {});
      const ọrụWord = res.body.data.find(({ word }: { word: string }) => word === 'ọrụ');
      expect(res.status).toEqual(200);
      expect(ọrụWord).toBeTruthy();
    });
  });
});
