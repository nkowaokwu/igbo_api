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
  ...rest
}) => {
  const { words, contentLength } = await findWordsWithMatch({ match: query, version, ...rest });
  return { words: sortDocsBy(searchWord, words, 'word', version), contentLength };
};

/* Searches for word with English stored in MongoDB */
export const searchWordUsingEnglish = async ({
  query,
  searchWord,
  version,
  ...rest
}) => {
  const { words, contentLength } = await findWordsWithMatch({ match: query, version, ...rest });
  const sortKey = version === Versions.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]';
  return { words: sortDocsBy(searchWord, words, sortKey, version), contentLength };
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
      wordFields,
      isUsingMainKey,
      redisAllVerbsAndSuffixesKey,
      allVerbsAndSuffixes,
      redisClient,
      ...rest
    } = await handleQueries(req);
    const searchQueries = {
      searchWord,
      skip,
      limit,
      dialects,
      examples,
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
        const wordsByEnglish = await searchWordUsingEnglish({ query, version, ...searchQueries });
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
        const wordsByIgbo = await searchWordUsingIgbo({ query, version, ...searchQueries });
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
    console.log('Number of words:', contentLength);
    return packageResponse({
      res,
      docs: words,
      contentLength,
      ...rest,
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
    const { id } = req.params;
    const {
      dialects,
      examples,
      version,
    } = await handleQueries(req);

    const updatedWord = await findWordsWithMatch({
      match: { _id: mongoose.Types.ObjectId(id) },
      version,
      limit: 1,
      dialects,
      examples,
    })
      .then(async ({ words: [word] }) => {
        if (!word) {
          throw new Error('No word exists with the provided id.');
        }
        return word;
      });
    return res.send(updatedWord);
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
