import isWord from 'is-word';
import { map, omit } from 'lodash';
import mongoose from 'mongoose';
import { handleWordFlags } from '../APIs/FlagsAPI';
import { wordSchema } from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import createRegExp from '../shared/utils/createRegExp';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import removePrefix from '../shared/utils/removePrefix';
import { IncomingWord, MiddleWare } from '../types';
import { createExample } from './examples';
import { WordResponseData } from './types';
import { handleQueries, packageResponse } from './utils';
import { findWordsWithMatch } from './utils/buildDocs';
import minimizeWords from './utils/minimizeWords';
import searchWordUsingEnglish from './utils/searchWordUsingEnglish';
import searchWordUsingIgbo from './utils/searchWordUsingIgbo';

const isEnglish = isWord('american-english');
const IGNORE_ENGLISH_WORDS = ['ego', 'la', 'mu', 'one', 'no', 'nu'];

/* Gets words from JSON dictionary */
export const getWordData: MiddleWare = (req, res, next) => {
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
const getWordsFromDatabase: MiddleWare = async (req, res, next) => {
  try {
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
    const isSearchWordEnglish =
      isEnglish.check(searchWord) &&
      Boolean(searchWord) &&
      !IGNORE_ENGLISH_WORDS.includes(searchWord);

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
export const getWords: MiddleWare = async (req, res, next) => {
  try {
    return getWordsFromDatabase(req, res, next);
  } catch (err: any) {
    return next(err);
  }
};

/* Returns a word from MongoDB using an id */
export const getWord: MiddleWare = async (req, res, next) => {
  try {
    const { id, flags, version } = await handleQueries(req);

    const updatedWord = await findWordsWithMatch({
      match: { _id: new mongoose.Types.ObjectId(id) },
      version,
    }).then(async (data) => {
      if (!data.words[0]) {
        throw new Error('No word exists with the provided id.');
      }
      // @ts-expect-error different versions
      const { words } = handleWordFlags({ data, flags });
      // @ts-expect-error different versions
      const minimizedWords = minimizeWords(words, version);
      return minimizedWords[0];
    });

    return packageResponse({
      res,
      // @ts-expect-error different versions
      docs: updatedWord,
      contentLength: 1,
      version,
    });
  } catch (err: any) {
    return next(err);
  }
};

/* Creates Word documents in MongoDB database for testing */
export const createWord = async (data: IncomingWord, connection: mongoose.Connection) => {
  const Word = connection.model<IncomingWord>('Word', wordSchema);

  const newWord = new Word(data);
  const savedWord = await newWord.save();

  /* Go through each word's example and create an Example document */
  const savedExamples = map(data.examples, async (example) => {
    const exampleData = omit({
      ...example,
      associatedWords: [savedWord.id],
    });
    const createdExample = await createExample(exampleData, connection);
    return createdExample;
  });

  /* Wait for all the Examples to be created and then add them to the Word document */
  const resolvedExamples = await Promise.all(savedExamples);
  const exampleIds = getDocumentsIds(resolvedExamples);
  savedWord.examples = exampleIds;
  return savedWord.save();
};
