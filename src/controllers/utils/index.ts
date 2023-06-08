import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { Request } from 'express';
import { RedisClientType } from 'redis';
import removePrefix from '../../shared/utils/removePrefix';
import { searchForAllVerbsAndSuffixesQuery } from './queries';
import createRegExp from '../../shared/utils/createRegExp';
import expandVerb from './expandVerb';
import expandNoun from './expandNoun';
import { findWordsWithMatch } from './buildDocs';
import Version from '../../shared/constants/Version';
import WordClass from '../../shared/constants/WordClass';
import { getAllCachedVerbsAndSuffixes, setAllCachedVerbsAndSuffixes } from '../../APIs/RedisAPI';
import convertToSkipAndLimit from './convertToSkipAndLimit';
import parseRange from './parseRange';

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
const constructRegexQuery = ({ isUsingMainKey, keywords }) => (
  isUsingMainKey
    ? createSimpleRegExp(keywords)
    : keywords?.length
      ? createSimpleRegExp(keywords)
      : { wordReg: /^[.{0,}\n{0,}]/, definitionsReg: /^[.{0,}\n{0,}]/ }
);

/* Packages the res response with sorting */
export const packageResponse = ({
  res,
  docs,
  contentLength,
  version,
}) => {
  res.set({ 'Content-Range': contentLength });
  const response = version === Version.VERSION_2 ? { data: docs, length: contentLength } : docs;
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

interface IgboAPIRequest extends Request {
  isUsingMainKey: boolean,
  redisClient: RedisClientType,
  query: {
    keyword?: string,
    page?: string,
    range?: string,
    filter?: string,
    strict?: string,
    dialects?: string,
    examples?: string,
    tags?: string,
    wordClasses?: string,
    resolve?: string,
  }
}

/* Handles all the queries for searching in the database */
export const handleQueries = async ({
  query = {},
  params = {},
  isUsingMainKey,
  baseUrl,
  redisClient,
} : IgboAPIRequest) => {
  const {
    keyword: keywordQuery = '',
    page: pageQuery = '0',
    range: rangeQuery = '',
    filter: filterQuery,
    strict: strictQuery,
    dialects: dialectsQuery,
    examples: examplesQuery,
    tags: tagsQuery,
    wordClasses: wordClassesQuery,
    resolve: resolveQuery,
  } = query;
  const { id } = params;
  let allVerbsAndSuffixes;
  const hasQuotes = keywordQuery && (keywordQuery.match(/["'].*["']/) !== null);
  const keyword = keywordQuery.replace(/["']/g, '');
  const version = baseUrl.endsWith(Version.VERSION_2) ? Version.VERSION_2 : Version.VERSION_1;
  const allVerbsAndSuffixesQuery = searchForAllVerbsAndSuffixesQuery();
  const cachedAllVerbsAndSuffixes = await getAllCachedVerbsAndSuffixes({ key: version, redisClient });
  if (version === Version.VERSION_2) {
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
  let keywords = version === Version.VERSION_2 && searchWord ? (
    expandVerb(searchWord, allVerbsAndSuffixes).map(({ text, wordClass }) => (
      {
        text,
        wordClass,
        regex: pick(constructRegexQuery({
          isUsingMainKey,
          keywords: [{ text }],
        }), ['wordReg']),
      }
    ))) : [];
  // Attempt to breakdown as noun if there is no breakdown as verb
  if (!keywords.length && searchWord) {
    keywords = version === Version.VERSION_2 ? (
      expandNoun(searchWord, allVerbsAndSuffixes).map(({ text, wordClass }) => (
        {
          text,
          wordClass: wordClass.concat([WordClass.NNC.value, WordClass.PRN.value, WordClass.NNP.value]),
          regex: pick(constructRegexQuery({
            isUsingMainKey,
            keywords: [{ text }],
          }), ['wordReg']),
        }
      ))) : [];
  }
  if (!keywords.length && searchWord) {
    console.time('Expand phrase time');
    keywords = (version === Version.VERSION_2 ? searchWordParts.map((searchWordPart, searchWordPartIndex) => {
      const expandedVerb = expandVerb(searchWordPart, allVerbsAndSuffixes);
      console.time(`Expand phrase part ${searchWordPartIndex}`);
      const result = expandedVerb.length ? expandedVerb.map(({ text, wordClass }) => (
        {
          text,
          wordClass,
          regex: pick(constructRegexQuery({
            isUsingMainKey,
            keywords: [{ text }],
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
