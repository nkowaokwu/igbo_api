import map from 'lodash/map';
import mongoose from 'mongoose';
import removePrefix from '../shared/utils/removePrefix';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import createRegExp from '../shared/utils/createRegExp';
import { REDIS_CACHE_EXPIRATION } from '../config';
import { packageResponse, handleQueries } from './utils';
import { findWordsWithMatch } from './utils/buildDocs';
import searchWordUsingEnglish from './utils/searchWordUsingEnglish';
import searchWordUsingIgbo from './utils/searchWordUsingIgbo';
import { createExample } from './examples';
import { wordSchema } from '../models/Word';

/* Gets words from JSON dictionary */
export const getWordData = (req, res, next) => {
  try {
    const { keyword } = req.query;
    const searchWord = removePrefix(keyword);
    if (!searchWord) {
      throw new Error(NO_PROVIDED_TERM);
    }
    const { wordReg: regexWord } = createRegExp(searchWord);
    return res.send(findSearchWord(regexWord, searchWord));
  } catch (err) {
    return next(err);
  }
};

/* Reuseable base controller function for getting words */
const getWordsFromDatabase = async (req, res, next) => {
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
      dialects,
      examples,
      resolve,
      hasQuotes,
      filteringParams,
      isUsingMainKey,
      redisClient,
    } = await handleQueries(req);
    const searchQueries = {
      searchWord,
      skip,
      limit,
      dialects,
      examples,
      resolve,
    };
    let words;
    let contentLength;
    if (hasQuotes) {
      const redisWordsCacheKey = `"${searchWord}"-${skip}-${limit}-${version}-${dialects}-${resolve}-${examples}`;
      const rawCachedWords = await redisClient.get(redisWordsCacheKey);
      const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
      if (cachedWords) {
        words = cachedWords.words;
        contentLength = cachedWords.contentLength;
      } else {
        const wordsByEnglish = await searchWordUsingEnglish({
          filteringParams,
          version,
          regex,
          ...searchQueries,
        });
        words = wordsByEnglish.words;
        contentLength = wordsByEnglish.contentLength;
        if (!redisClient.isFake) {
          redisClient.set(redisWordsCacheKey, JSON.stringify({ words, contentLength }), 'EX', REDIS_CACHE_EXPIRATION);
        }
      }
    } else {
      const parsedSegments = [...searchWord.split(' ')];
      parsedSegments.shift();

      const redisWordsCacheKey = `${searchWord}-${skip}-${limit}-${version}-${dialects}-${resolve}-${examples}`;
      const rawCachedWords = await redisClient.get(redisWordsCacheKey);
      const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
      if (cachedWords) {
        words = cachedWords.words;
        contentLength = cachedWords.contentLength;
      } else {
        const wordsByIgbo = await searchWordUsingIgbo({
          keywords,
          version,
          regex,
          strict,
          isUsingMainKey,
          filteringParams,
          ...searchQueries,
        });
        words = wordsByIgbo.words;
        contentLength = wordsByIgbo.contentLength;
        if (!redisClient.isFake) {
          redisClient.set(redisWordsCacheKey, JSON.stringify({ words, contentLength }), 'EX', REDIS_CACHE_EXPIRATION);
        }
      }
    }
    console.log(`Number of words for search word "${searchWord}": ${contentLength}`);
    console.timeEnd('Getting words from database');
    return packageResponse({
      res,
      docs: words,
      contentLength,
      version,
    });
  } catch (err) {
    return next(err);
  }
};
/* Gets words from MongoDB */
export const getWords = async (req, res, next) => {
  try {
    return getWordsFromDatabase(req, res, next);
  } catch (err) {
    return next(err);
  }
};

/* Returns a word from MongoDB using an id */
export const getWord = async (req, res, next) => {
  try {
    const {
      id,
      dialects,
      examples,
      resolve,
      version,
    } = await handleQueries(req);

    const updatedWord = await findWordsWithMatch({
      match: { _id: mongoose.Types.ObjectId(id) },
      version,
      dialects,
      examples,
      resolve,
    })
      .then(async ({ words: [word] }) => {
        if (!word) {
          throw new Error('No word exists with the provided id.');
        }
        return word;
      });
    return packageResponse({
      res,
      docs: updatedWord,
      contentLength: 1,
      version,
    });
  } catch (err) {
    return next(err);
  }
};

/* Creates Word documents in MongoDB database */
export const createWord = async (data, connection) => {
  const Word = connection.model('Word', wordSchema);
  const {
    examples,
    word,
    wordClass,
    definitions,
    variations,
    stems,
    dialects,
    ...rest
  } = data;

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
