import stringSimilarity from 'string-similarity';
import isNaN from 'lodash/isNaN';
import get from 'lodash/get';
import pick from 'lodash/pick';
import removeAccents from '../../shared/utils/removeAccents';
import removePrefix from '../../shared/utils/removePrefix';
import { searchForAllVerbsAndSuffixesQuery } from './queries';
import createRegExp from '../../shared/utils/createRegExp';
import expandVerb from './expandVerb';
import expandNoun from './expandNoun';
import { findWordsWithMatch } from './buildDocs';
import Versions from '../../shared/constants/Versions';

const DEFAULT_RESPONSE_LIMIT = 10;
const MAX_RESPONSE_LIMIT = 25;
const MATCHING_DEFINITION = 1000;
const SIMILARITY_FACTOR = 100;
const VERB_AND_SUFFIXES_LIMIT = 5000;
const NO_FACTOR = 0;

const generateSecondaryKey = (version) => (
  version === Versions.VERSION_1 ? 'definitions[0]' : 'definitions[0].definitions[0]'
);

const createSimpleRegExp = (keywords) => ({
  wordReg: new RegExp(`${keywords.map((keyword) => (
    `(${createRegExp(keyword.text, true).wordReg.source})`
  )).join('|')}`, 'i'),
  definitionsReg: new RegExp(`${keywords.map((keyword) => (
    `(${createRegExp(keyword.text, true).definitionsReg.source})`
  )).join('|')}`, 'i'),
});

/* Determines if an empty response should be returned
 * if the request comes from an application not using MAIN_KEY
 */
const constructRegexQuery = ({ isUsingMainKey, keywords, strict = false }) => (
  isUsingMainKey
    ? createSimpleRegExp(keywords, strict)
    : keywords?.length
      ? createSimpleRegExp(keywords, strict)
      : { wordReg: /^[.{0,}\n{0,}]/, definitionsReg: /^[.{0,}\n{0,}]/ }
);

/* Sorts all the docs based on the provided searchWord */
export const sortDocsBy = (searchWord, docs, key, version) => (
  docs.sort((prevDoc, nextDoc) => {
    const normalizedSearchWord = searchWord.normalize('NFC');
    const prevDocValue = get(prevDoc, key);
    const nextDocValue = get(nextDoc, key);
    const cleanedPrevDocValue = removeAccents.removeExcluding(prevDocValue).normalize('NFC');
    const cleanedNextDocValue = removeAccents.removeExcluding(nextDocValue).normalize('NFC');
    const prevSecondaryKeyValue = get(prevDoc, generateSecondaryKey(version)) || '';
    const nextSecondaryKeyValue = get(nextDoc, generateSecondaryKey(version)) || '';
    const prevMatchingDefinitionFactor = prevSecondaryKeyValue.includes(normalizedSearchWord)
      ? MATCHING_DEFINITION
      : NO_FACTOR;
    const nextMatchingDefinitionFactor = nextSecondaryKeyValue.includes(normalizedSearchWord)
      ? MATCHING_DEFINITION
      : NO_FACTOR;

    const prevDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedPrevDocValue);
    const nextDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedNextDocValue);

    const finalPrevDocDiff = prevDocDifference * SIMILARITY_FACTOR + prevMatchingDefinitionFactor;
    const finalNextDocDiff = nextDocDifference * SIMILARITY_FACTOR + nextMatchingDefinitionFactor;

    if (finalPrevDocDiff === finalNextDocDiff) {
      return NO_FACTOR;
    }
    return finalPrevDocDiff > finalNextDocDiff ? -1 : 1;
  })
);

/* Validates the provided range */
export const isValidRange = (range) => {
  if (!Array.isArray(range)) {
    return false;
  }

  /* Invalid range if first element is larger than the second */
  if (range[0] >= range[1]) {
    return false;
  }

  const validRange = range;
  validRange[1] += 1;
  return !(validRange[1] - validRange[0] > MAX_RESPONSE_LIMIT) && !(validRange[1] - validRange[0] < 0);
};

/* Takes both page and range and converts them into appropriate skip and limit */
export const convertToSkipAndLimit = ({ page, range }) => {
  let skip = 0;
  let limit = 10;
  if (isValidRange(range)) {
    [skip] = range;
    limit = range[1] - range[0];
    return { skip, limit };
  }

  if (isNaN(page)) {
    throw new Error('Page is not a number.');
  }
  const calculatedSkip = page * DEFAULT_RESPONSE_LIMIT;
  if (calculatedSkip < 0) {
    throw new Error('Page must be a positive number.');
  }
  return { skip: calculatedSkip, limit };
};

/* Packages the res response with sorting */
export const packageResponse = ({
  res,
  docs,
  contentLength,
}) => {
  res.setHeader('Content-Range', contentLength);
  return res.send(docs);
};

/* Converts the filter query into a word to be used as the keyword query */
const convertFilterToKeyword = (filter = '{"word": ""}') => {
  try {
    const parsedFilter = typeof filter === 'object' ? filter : JSON.parse(filter) || { word: '' };
    const firstFilterKey = Object.keys(parsedFilter)[0];
    return parsedFilter[firstFilterKey];
  } catch {
    throw new Error(`Invalid filter query syntax. Expected: {"word":"filter"}, Received: ${filter}`);
  }
};

/* Parses the ranges query to turn into an array */
const parseRange = (range) => {
  try {
    if (!range) {
      return null;
    }
    const parsedRange = typeof range === 'object' ? range : JSON.parse(range) || null;
    return parsedRange;
  } catch {
    throw new Error(`Invalid range query syntax. Expected: [x,y], Received: ${range}`);
  }
};

const searchAllVerbsAndSuffixes = async ({
  query,
  version,
}) => {
  const { words, contentLength } = await findWordsWithMatch({
    match: query,
    version,
    skip: 0,
    limit: VERB_AND_SUFFIXES_LIMIT,
  });
  return { words, contentLength };
};

/* Handles all the queries for searching in the database */
export const handleQueries = async ({
  query = {},
  isUsingMainKey,
  baseUrl,
  redisClient,
}) => {
  const {
    keyword = '',
    page: pageQuery = 0,
    range: rangeQuery = '',
    filter: filterQuery,
    strict: strictQuery,
    dialects: dialectsQuery,
    examples: examplesQuery,
    isStandardIgbo,
    pronunciation,
    nsibidi,
  } = query;
  let allVerbsAndSuffixes;
  const version = baseUrl.endsWith(Versions.VERSION_2) ? Versions.VERSION_2 : Versions.VERSION_1;
  const allVerbsAndSuffixesQuery = searchForAllVerbsAndSuffixesQuery();
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${version}`;
  const cachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  if (version === Versions.VERSION_2) {
    if (cachedAllVerbsAndSuffixes) {
      allVerbsAndSuffixes = JSON.parse(cachedAllVerbsAndSuffixes);
    } else {
      allVerbsAndSuffixes = (await searchAllVerbsAndSuffixes({ query: allVerbsAndSuffixesQuery, version })).words;
    }
  }
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '')
    .replace(/[Aa]na m /, 'm ');
  const searchWordParts = searchWord.split(' ');
  const regex = constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWord }] });
  const regexes = searchWordParts.reduce((regexesObject, searchWordPart) => ({
    ...regexesObject,
    [searchWordPart]: constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWordPart }] }),
  }), {});
  console.log(`Word splits: ${searchWordParts}`);
  console.log(`Search word: ${searchWord}`);
  let keywords = version === Versions.VERSION_2 ? (
    expandVerb(searchWord, allVerbsAndSuffixes, version).map(({ text, wordClass }) => (
      {
        text,
        wordClass,
        regex: pick(constructRegexQuery({
          isUsingMainKey,
          keywords: [{ text }],
          strict: true,
        }), ['wordReg']),
      }
    ))) : [];
  // Attempt to breakdown as noun if there is no breakdown as verb
  if (!keywords.length) {
    keywords = version === Versions.VERSION_2 ? (
      expandNoun(searchWord, allVerbsAndSuffixes, version).map(({ text, wordClass }) => (
        {
          text,
          wordClass,
          regex: pick(constructRegexQuery({
            isUsingMainKey,
            keywords: [{ text }],
            strict: true,
          }), ['wordReg']),
        }
      ))) : [];
  }
  if (!keywords.length) {
    keywords = (version === Versions.VERSION_2 ? searchWordParts.map((searchWordPart) => {
      const expandedVerb = expandVerb(searchWordPart, allVerbsAndSuffixes, version);
      return expandedVerb.length ? expandedVerb.map(({ text, wordClass }) => (
        {
          text,
          wordClass,
          regex: pick(constructRegexQuery({
            isUsingMainKey,
            keywords: [{ text }],
            strict: true,
          }), ['wordReg']),
        }
      )) : [{ text: searchWordPart, wordClass: [], regex: regexes[searchWordPart] }];
    }) : []).flat();
  }
  const page = parseInt(pageQuery, 10);
  const range = parseRange(rangeQuery);
  const { skip, limit } = convertToSkipAndLimit({ page, range });
  const strict = strictQuery === 'true';
  const dialects = dialectsQuery === 'true';
  const examples = examplesQuery === 'true';
  return {
    version,
    searchWord,
    keywords,
    regex,
    page,
    skip,
    limit,
    strict,
    dialects,
    examples,
    isUsingMainKey,
    wordFields: {
      isStandardIgbo,
      pronunciation,
      nsibidi,
    },
    redisAllVerbsAndSuffixesKey,
    allVerbsAndSuffixes,
    redisClient,
  };
};
