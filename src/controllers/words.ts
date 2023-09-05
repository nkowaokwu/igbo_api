import map from 'lodash/map';
import mongoose from 'mongoose';
import isWord from 'is-word';
import removePrefix from '../shared/utils/removePrefix';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import createRegExp from '../shared/utils/createRegExp';
import { packageResponse, handleQueries } from './utils';
import { findWordsWithMatch } from './utils/buildDocs';
import searchWordUsingEnglish from './utils/searchWordUsingEnglish';
import searchWordUsingIgbo from './utils/searchWordUsingIgbo';
import { createExample } from './examples';
import { wordSchema } from '../models/Word';
import { handleWordFlags } from '../APIs/FlagsAPI';
import minimizeWords from './utils/minimizeWords';
import { Express, LegacyWord } from '../types';
import { WordResponseData } from './types';

const isEnglish = isWord('american-english');

/* Gets words from JSON dictionary */
export const getWordData: Express.MiddleWare = (req, res, next) => {
  try {
    const { keyword } = req.query;
    const searchWord = removePrefix(keyword);
    if (!searchWord) {
      throw new Error(NO_PROVIDED_TERM);
    }
    const { wordReg: regexWord } = createRegExp(searchWord);
    return res.send(findSearchWord(regexWord, searchWord));
  } catch (err: any) {
    return next(err);
  }
};

/* Reuseable base controller function for getting words */
const getWordsFromDatabase: Express.MiddleWare = async (req, res, next) => {
  try {
    console.time('Getting words from database');
    const {
      version,
      searchWord,
      keywords,
      regex,
      skip,
      limit,
      strict,
      flags,
      filters,
      hasQuotes,
      isUsingMainKey,
      redisClient,
    } = await handleQueries(req);
    const searchQueries = {
      searchWord,
      skip,
      limit,
      flags,
      filters,
    };
    let responseData: WordResponseData = { words: [], contentLength: 0 };
    const isSearchWordEnglish = isEnglish.check(searchWord) && !!searchWord;
    if (hasQuotes || isSearchWordEnglish) {
      responseData = await searchWordUsingEnglish({
        redisClient,
        version,
        regex,
        ...searchQueries,
      });
    } else {
      responseData = await searchWordUsingIgbo({
        redisClient,
        keywords,
        version,
        regex,
        strict,
        isUsingMainKey,
        ...searchQueries,
      });
    }
    console.log(`Number of words for search word "${searchWord}": ${responseData.contentLength}`);
    console.timeEnd('Getting words from database');
    return packageResponse({
      res,
      docs: responseData.words,
      contentLength: responseData.contentLength,
      version,
    });
  } catch (err: any) {
    return next(err);
  }
};
/* Gets words from MongoDB */
export const getWords: Express.MiddleWare = async (req, res, next) => {
  try {
    return getWordsFromDatabase(req, res, next);
  } catch (err: any) {
    return next(err);
  }
};

/* Returns a word from MongoDB using an id */
export const getWord: Express.MiddleWare = async (req, res, next) => {
  try {
    const { id, flags, version } = await handleQueries(req);

    const updatedWord = await findWordsWithMatch({
      match: { _id: new mongoose.Types.ObjectId(id) },
      version,
    }).then(async (data) => {
      if (!data.words[0]) {
        throw new Error('No word exists with the provided id.');
      }
      const { words } = handleWordFlags({ data, flags });
      const minimizedWords = minimizeWords(words, version);
      return minimizedWords[0];
    });
    return packageResponse({
      res,
      docs: updatedWord,
      contentLength: 1,
      version,
    });
  } catch (err: any) {
    return next(err);
  }
};

/* Creates Word documents in MongoDB database for testing */
export const createWord = async (data: LegacyWord, connection: mongoose.Connection) => {
  const Word = connection.model('Word', wordSchema);
  const { examples, word, wordClass, definitions, variations, stems, dialects, ...rest } = data;

  const wordData = {
    word,
    wordClass,
    definitions,
    variations,
    stems,
    dialects,
    ...rest,
  };

  const newWord = new Word(wordData);
  await newWord.save();

  /* Go through each word's example and create an Example document */
  const savedExamples = map(examples, async (example) => {
    const exampleData = {
      ...example,
      associatedWords: [newWord.id],
    };
    const createdExample = await createExample(exampleData, connection);
    return createdExample;
  });

  /* Wait for all the Examples to be created and then add them to the Word document */
  const resolvedExamples = await Promise.all(savedExamples);
  const exampleIds = getDocumentsIds(resolvedExamples);
  newWord.examples = exampleIds;
  return newWord.save();
};
