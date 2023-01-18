import map from 'lodash/map';
import compact from 'lodash/compact';
import mongoose from 'mongoose';
import removePrefix from '../shared/utils/removePrefix';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import createRegExp from '../shared/utils/createRegExp';
import { REDIS_CACHE_EXPIRATION } from '../config';
import { sortDocsBy, packageResponse, handleQueries } from './utils';
import { searchIgboTextSearch, strictSearchIgboQuery, searchEnglishRegexQuery } from './utils/queries';
import { findWordsWithMatch } from './utils/buildDocs';
import { createExample } from './examples';
import Versions from '../shared/constants/Versions';
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

/* Searches for a word with Igbo stored in MongoDB */
export const searchWordUsingIgbo = async ({
  query,
  searchWord,
  version,
  regex,
  skip,
  limit,
  ...rest
}) => {
  const { words, contentLength } = await findWordsWithMatch({ match: query, version, ...rest });
  let sortedWords = sortDocsBy(searchWord, words, 'word', version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  return { words: sortedWords, contentLength };
};

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = async ({
  query,
  searchWord,
  version,
  regex,
  skip,
  limit,
  ...rest
}) => {
  const { words, contentLength } = await findWordsWithMatch({ match: query, version, ...rest });
  const sortKey = version === Versions.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]';
  let sortedWords = sortDocsBy(searchWord, words, sortKey, version, regex);
  sortedWords = sortedWords.slice(skip, skip + limit);
  return { words: sortedWords, contentLength };
};

/* Creates an object containing truthy key/value pairs for looking up words */
const generateFilteringParams = (filteringParams) => (
  Object.entries(filteringParams).reduce((finalRequiredAttributes, [key, value]) => {
    if (key === 'isStandardIgbo' && value) {
      return {
        ...finalRequiredAttributes,
        [`attributes.${key}`]: { $eq: true },
      };
    }
    if (key === 'nsibidi' && value) {
      return {
        ...finalRequiredAttributes,
        [`definitions.${key}`]: { $ne: '' },
      };
    }
    if (key === 'pronunciation' && value) {
      return {
        ...finalRequiredAttributes,
        pronunciation: { $exists: true },
        $expr: { $gt: [{ $strLenCP: '$pronunciation' }, 10] },
      };
    }
    return finalRequiredAttributes;
  }, {})
);

/* Reuseable base controller function for getting words */
const getWordsFromDatabase = async (req, res, next) => {
  try {
    const hasQuotes = req.query.keyword && (req.query.keyword.match(/["'].*["']/) !== null);
    if (hasQuotes) {
      req.query.keyword = req.query.keyword.replace(/["']/g, '');
    }
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
      wordFields,
      isUsingMainKey,
      redisAllVerbsAndSuffixesKey,
      allVerbsAndSuffixes,
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
    let query;
    const filteringParams = generateFilteringParams(wordFields);
    if (hasQuotes) {
      const redisWordsCacheKey = `"${searchWord}"-${skip}-${limit}-${version}-${dialects}-${examples}`;
      const rawCachedWords = await redisClient.get(redisWordsCacheKey);
      const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
      if (cachedWords) {
        words = cachedWords.words;
        contentLength = cachedWords.contentLength;
      } else {
        query = searchEnglishRegexQuery({ regex, filteringParams });
        console.time(`Searching English words for ${searchWord}`);
        const wordsByEnglish = await searchWordUsingEnglish({
          query,
          version,
          regex,
          ...searchQueries,
        });
        console.timeEnd(`Searching English words for ${searchWord}`);
        words = wordsByEnglish.words;
        contentLength = wordsByEnglish.contentLength;
        if (!redisClient.isFake) {
          redisClient.set(redisWordsCacheKey, JSON.stringify({ words, contentLength }), 'EX', REDIS_CACHE_EXPIRATION);
          redisClient.set(
            redisAllVerbsAndSuffixesKey,
            `${JSON.stringify(allVerbsAndSuffixes)}`,
            'EX',
            REDIS_CACHE_EXPIRATION,
          );
        }
      }
    } else {
      const parsedSegments = [...searchWord.split(' ')];
      parsedSegments.shift();
      const allSearchKeywords = compact(keywords.concat(searchWord
        ? { text: searchWord, wordClass: [], regex }
        : null),
      );
      const regularSearchIgboQuery = searchIgboTextSearch({
        keywords: allSearchKeywords,
        isUsingMainKey,
        filteringParams,
      });
      query = !strict
        ? regularSearchIgboQuery
        : strictSearchIgboQuery(
          allSearchKeywords,
        );
      const redisWordsCacheKey = `${searchWord}-${skip}-${limit}-${version}-${dialects}-${examples}`;
      const rawCachedWords = await redisClient.get(redisWordsCacheKey);
      const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
      if (cachedWords) {
        words = cachedWords.words;
        contentLength = cachedWords.contentLength;
      } else {
        console.time(`Searching Igbo words for ${searchWord}`);
        const wordsByIgbo = await searchWordUsingIgbo({
          query,
          version,
          regex,
          ...searchQueries,
        });
        console.timeEnd(`Searching Igbo words ${searchWord}`);
        words = wordsByIgbo.words;
        contentLength = wordsByIgbo.contentLength;
        if (!redisClient.isFake) {
          redisClient.set(redisWordsCacheKey, JSON.stringify({ words, contentLength }), 'EX', REDIS_CACHE_EXPIRATION);
          redisClient.set(
            redisAllVerbsAndSuffixesKey,
            JSON.stringify(allVerbsAndSuffixes),
            'EX',
            REDIS_CACHE_EXPIRATION,
          );
        }
      }
    }
    console.log(`Number of words for search word "${searchWord}": ${contentLength}`);
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
