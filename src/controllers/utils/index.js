import stringSimilarity from 'string-similarity';
import compact from 'lodash/compact';
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
import WordClass from '../../shared/constants/WordClass';
import { getAllCachedVerbsAndSuffixes, setAllCachedVerbsAndSuffixes } from '../../APIs/RedisAPI';

const DEFAULT_RESPONSE_LIMIT = 10;
const MAX_RESPONSE_LIMIT = 25;
const MATCHING_DEFINITION_INDEX = 1000;
const MATCHING_DEFINITION_INDEX_FACTOR = 100;
const WORD_LENGTH_FACTOR = 100;
const WORD_LENGTH_DIFFERENCE_FACTOR = 15;
const IS_COMMON = 1000;
const SIMILARITY_FACTOR = 100;
const EXACT_MATCH_FACTOR = 2000;
const SIMILAR_WORD_THRESHOLD = 1.5;
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
  hardDefinitionsReg: new RegExp(`${keywords.map((keyword) => (
    `(${createRegExp(keyword.text, true).hardDefinitionsReg.source})`
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
export const sortDocsBy = (searchWord, docs, key, version, regex) => (
  docs.sort((prevDoc, nextDoc) => {
    const normalizedSearchWord = removePrefix(searchWord.normalize('NFC'));
    const prevDocValue = get(prevDoc, key);
    const nextDocValue = get(nextDoc, key);
    const cleanedPrevDocValueWithUnderdots = removeAccents.removeExcluding(prevDocValue).normalize('NFC');
    const cleanedNextDocValueWithUnderdots = removeAccents.removeExcluding(nextDocValue).normalize('NFC');
    const cleanedPrevDocValue = removeAccents.remove(prevDocValue).normalize('NFC');
    const cleanedNextDocValue = removeAccents.remove(nextDocValue).normalize('NFC');
    const prevDocValueLengthDifference = (
      WORD_LENGTH_FACTOR
      - (
        Math.abs(normalizedSearchWord.length - removePrefix(cleanedPrevDocValueWithUnderdots).length)
        * WORD_LENGTH_DIFFERENCE_FACTOR
      )
    );
    const nextDocValueLengthDifference = (
      WORD_LENGTH_FACTOR
      - (
        Math.abs(normalizedSearchWord.length - removePrefix(cleanedNextDocValueWithUnderdots).length)
        * WORD_LENGTH_DIFFERENCE_FACTOR
      )
    );
    const prevSecondaryKeyValue = get(prevDoc, generateSecondaryKey(version)) || '';
    const nextSecondaryKeyValue = get(nextDoc, generateSecondaryKey(version)) || '';
    const rawPrevDefinitionMatchIndex = prevSecondaryKeyValue?.search?.(regex.hardDefinitionsReg) || -1;
    const rawNextDefinitionMatchIndex = nextSecondaryKeyValue?.search?.(regex.hardDefinitionsReg) || -1;
    const prevDefinitionMatchIndexValue = rawPrevDefinitionMatchIndex === -1
      ? 11
      : rawPrevDefinitionMatchIndex;
    const nextDefinitionMatchIndexValue = rawNextDefinitionMatchIndex === -1
      ? 11
      : rawNextDefinitionMatchIndex;
    const prevDefinitionMatchIndexFactor = (
      MATCHING_DEFINITION_INDEX - (prevDefinitionMatchIndexValue * MATCHING_DEFINITION_INDEX_FACTOR)
    );
    const nextDefinitionMatchIndexFactor = (
      MATCHING_DEFINITION_INDEX - (nextDefinitionMatchIndexValue * MATCHING_DEFINITION_INDEX_FACTOR)
    );

    const prevDocDifferenceWithUnderdots = stringSimilarity
      .compareTwoStrings(normalizedSearchWord, cleanedPrevDocValueWithUnderdots);
    const nextDocDifferenceWithUnderdots = stringSimilarity
      .compareTwoStrings(normalizedSearchWord, cleanedNextDocValueWithUnderdots);
    const prevDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedPrevDocValue);
    const nextDocDifference = stringSimilarity.compareTwoStrings(normalizedSearchWord, cleanedNextDocValue);

    const prevDocDifferences = (
      prevDocDifference
      + (prevDocDifference === 1 ? EXACT_MATCH_FACTOR : 0)
      + prevDocDifferenceWithUnderdots
      + (prevDocDifferenceWithUnderdots === 1 ? EXACT_MATCH_FACTOR : 0)
    );
    const nextDocDifferences = (
      nextDocDifference
      + (nextDocDifference === 1 ? EXACT_MATCH_FACTOR : 0)
      + nextDocDifferenceWithUnderdots
      + (nextDocDifferenceWithUnderdots === 1 ? EXACT_MATCH_FACTOR : 0)
    );

    const prevDocSimilarityFactor = (prevDocDifferences >= SIMILAR_WORD_THRESHOLD
      ? prevDocValueLengthDifference : 0) * SIMILARITY_FACTOR + (prevDocDifferences * SIMILARITY_FACTOR);
    const nextDocSimilarityFactor = (nextDocDifferences >= SIMILAR_WORD_THRESHOLD
      ? nextDocValueLengthDifference : 0) * SIMILARITY_FACTOR + (nextDocDifferences * SIMILARITY_FACTOR);

    const prevDocIsCommonFactor = prevDoc?.attributes?.isCommon && prevDocDifferences > 1 ? IS_COMMON : 0;
    const nextDocIsCommonFactor = nextDoc?.attributes?.isCommon && nextDocDifferences > 1 ? IS_COMMON : 0;

    const finalPrevDocDiff = prevDocSimilarityFactor + prevDocIsCommonFactor + prevDefinitionMatchIndexFactor;
    const finalNextDocDiff = nextDocSimilarityFactor + nextDocIsCommonFactor + nextDefinitionMatchIndexFactor;

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
  version,
}) => {
  res.set({ 'Content-Range': contentLength });
  res.removeHeader('Transfer-Encoding');
  res.removeHeader('X-Powered-By');
  const response = version === Versions.VERSION_2 ? { data: docs, length: contentLength } : docs;
  return res.send(response);
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

/* Gets all verbs and suffixes within the Igbo API */
const searchAllVerbsAndSuffixes = async ({
  query,
  version,
}) => {
  const { words, contentLength } = await findWordsWithMatch({
    match: query,
    version,
    lean: true,
  });
  return { words, contentLength };
};

/* Handles all the queries for searching in the database */
export const handleQueries = async ({
  query = {},
  params = {},
  isUsingMainKey,
  baseUrl,
  redisClient,
}) => {
  const {
    keyword: keywordQuery = '',
    page: pageQuery = 0,
    range: rangeQuery = '',
    filter: filterQuery,
    strict: strictQuery,
    dialects: dialectsQuery,
    examples: examplesQuery,
    tags: tagsQuery,
    wordClasses: wordClassesQuery,
    resolve: resolveQuery,
  } = query;
  console.time('Handling queries');
  const { id } = params;
  let allVerbsAndSuffixes;
  const hasQuotes = keywordQuery && (keywordQuery.match(/["'].*["']/) !== null);
  const keyword = keywordQuery.replace(/["']/g, '');
  const version = baseUrl.endsWith(Versions.VERSION_2) ? Versions.VERSION_2 : Versions.VERSION_1;
  const allVerbsAndSuffixesQuery = searchForAllVerbsAndSuffixesQuery();
  const cachedAllVerbsAndSuffixes = await getAllCachedVerbsAndSuffixes({ key: version, redisClient });
  if (version === Versions.VERSION_2) {
    console.time('Searching all verbs and suffixes');
    if (cachedAllVerbsAndSuffixes) {
      console.log('Getting all verbs and suffixes from cache');
      allVerbsAndSuffixes = cachedAllVerbsAndSuffixes;
    } else {
      const allVerbsAndSuffixesDb = (
        await searchAllVerbsAndSuffixes({ query: allVerbsAndSuffixesQuery, version })
      ).words;
      allVerbsAndSuffixes = await setAllCachedVerbsAndSuffixes({
        key: version,
        data: allVerbsAndSuffixesDb,
        redisClient,
        version,
      });
    }
    console.timeEnd('Searching all verbs and suffixes');
  }
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '')
    .replace(/[Aa]na m /, 'm ');
  const searchWordParts = compact(searchWord.split(' '));
  const regex = constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWord }] });
  const regexes = searchWordParts.reduce((regexesObject, searchWordPart) => ({
    ...regexesObject,
    [searchWordPart]: constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWordPart }] }),
  }), {});
  console.log('Word splits:', searchWordParts);
  console.log(`Search word: ${searchWord}`);
  let keywords = version === Versions.VERSION_2 && searchWord ? (
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
  if (!keywords.length && searchWord) {
    keywords = version === Versions.VERSION_2 ? (
      expandNoun(searchWord, allVerbsAndSuffixes, version).map(({ text, wordClass }) => (
        {
          text,
          wordClass: wordClass.concat([WordClass.NNC.value, WordClass.PRN.value, WordClass.NNP.value]),
          regex: pick(constructRegexQuery({
            isUsingMainKey,
            keywords: [{ text }],
            strict: true,
          }), ['wordReg']),
        }
      ))) : [];
  }
  if (!keywords.length && searchWord) {
    console.time('Expand phrase time');
    keywords = (version === Versions.VERSION_2 ? searchWordParts.map((searchWordPart, searchWordPartIndex) => {
      const expandedVerb = expandVerb(searchWordPart, allVerbsAndSuffixes, version);
      console.time(`Expand phrase part ${searchWordPartIndex}`);
      const result = expandedVerb.length ? expandedVerb.map(({ text, wordClass }) => (
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
      console.timeEnd(`Expand phrase part ${searchWordPartIndex}`);
      return result;
    }) : []).flat();
    console.timeEnd('Expand phrase time');
  }
  const page = parseInt(pageQuery, 10);
  const range = parseRange(rangeQuery);
  const { skip, limit } = convertToSkipAndLimit({ page, range });
  const strict = strictQuery === 'true';
  const dialects = dialectsQuery === 'true';
  const examples = examplesQuery === 'true';
  const tags = tagsQuery ? tagsQuery.replaceAll(/[[\]']/g, '').split(',').map((tag) => tag.trim()) : [];
  const wordClasses = wordClassesQuery ? wordClassesQuery.replaceAll(/[[\]']/g, '').split(',')
    .map((wordClass) => wordClass.trim()) : [];
  const resolve = resolveQuery === 'true';
  const flags = {
    dialects,
    examples,
    resolve,
  };
  const filters = {
    ...(tags?.length ? { tags: { $in: tags } } : {}),
    ...(wordClasses?.length ? { 'definitions.wordClass': { $in: wordClasses } } : {}),
  };
  console.timeEnd('Handling queries');
  return {
    id,
    version,
    searchWord,
    keywords,
    regex,
    page,
    skip,
    limit,
    strict,
    flags,
    filters,
    hasQuotes,
    isUsingMainKey,
    redisClient,
  };
};
