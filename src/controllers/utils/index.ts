import { Response } from 'express';
import { PipelineStage } from 'mongoose';
import { compact, pick } from 'lodash';
import { Example, IgboAPIRequest, Word } from '../../types';
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
import { WordData, Keyword, Flags } from './types';
import { Filters, ExampleWithPronunciation } from '../types';
import ExampleStyles from '../../shared/constants/ExampleStyles';

const createSimpleRegExp = (keywords: { text: string }[]) => ({
  wordReg: new RegExp(
    `${keywords
      .map((keyword) => `(${createRegExp(keyword.text, true).wordReg.source})`)
      .join('|')}`,
    'i'
  ),
  exampleReg: new RegExp(
    `${keywords
      .map((keyword) => `(${createRegExp(keyword.text, true).exampleReg.source})`)
      .join('|')}`,
    'i'
  ),
  definitionsReg: new RegExp(
    `${keywords
      .map((keyword) => `(${createRegExp(keyword.text, true).definitionsReg.source})`)
      .join('|')}`,
    'i'
  ),
  hardDefinitionsReg: new RegExp(
    `${keywords
      .map(
        (keyword) =>
          `(${
            (createRegExp(keyword.text, true).hardDefinitionsReg || { source: keyword.text }).source
          })`
      )
      .join('|')}`,
    'i'
  ),
});

/* Determines if an empty response should be returned
 * if the request comes from an application not using MAIN_KEY
 */
const constructRegexQuery = ({
  isUsingMainKey,
  keywords,
}: {
  isUsingMainKey: boolean | undefined,
  keywords: { text: string }[],
}) =>
  isUsingMainKey
    ? createSimpleRegExp(keywords)
    : keywords?.length
      ? createSimpleRegExp(keywords)
      : {
          wordReg: /^[.{0,}\n{0,}]/,
          exampleReg: /^[.{0,}\n{0,}]/,
          definitionsReg: /^[.{0,}\n{0,}]/,
        };

/* Packages the res response with sorting */
export const packageResponse = ({
  res,
  docs,
  contentLength,
  version,
}: {
  res: Response,
  docs:
    | Partial<Word>
    | Partial<Example>
    | Partial<ExampleWithPronunciation>
    | Partial<Word>[]
    | Partial<Example>[]
    | Partial<ExampleWithPronunciation>[],
  contentLength: number,
  version: Version,
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
    throw new Error(
      `Invalid filter query syntax. Expected: {"word":"filter"}, Received: ${filter}`
    );
  }
};

/* Gets all verbs and suffixes within the Igbo API */
const searchAllVerbsAndSuffixes = async ({
  query,
  version,
}: {
  query: PipelineStage.Match['$match'],
  version: Version,
}): Promise<{ words: Word[], contentLength: number }> => {
  const { words, contentLength } = await findWordsWithMatch({
    match: query,
    version,
    lean: true,
  });
  // @ts-expect-error types
  return { words, contentLength };
};

/* Handles all the queries for searching in the database */
export const handleQueries = async ({
  query = {},
  params = {},
  isUsingMainKey,
  baseUrl,
  redisClient,
}: IgboAPIRequest) => {
  const {
    keyword: keywordQuery = '',
    page: pageQuery = '0',
    range: rangeQuery = '',
    filter: filterQuery,
    strict: strictQuery,
    dialects: dialectsQuery,
    examples: examplesQuery,
    style: stylesQuery,
    tags: tagsQuery,
    wordClasses: wordClassesQuery,
    resolve: resolveQuery,
  } = query;
  const { id } = params;
  let allVerbsAndSuffixes: WordData = { verbs: [], suffixes: [] };
  const hasQuotes = keywordQuery && keywordQuery.match(/["'].*["']/) !== null;
  const keyword = keywordQuery.replace(/["']/g, '');
  const version = baseUrl.endsWith(Version.VERSION_2) ? Version.VERSION_2 : Version.VERSION_1;
  const allVerbsAndSuffixesQuery: PipelineStage.Match['$match'] =
    searchForAllVerbsAndSuffixesQuery();
  const cachedAllVerbsAndSuffixes = await getAllCachedVerbsAndSuffixes({
    key: version,
    redisClient,
  });
  if (version === Version.VERSION_2) {
    if (cachedAllVerbsAndSuffixes) {
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
  }
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '').replace(/[Aa]na m /, 'm ');
  const searchWordParts = compact(searchWord.split(' '));
  const regex = constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWord }] });
  const regexes = searchWordParts.reduce(
    (regexesObject, searchWordPart) => ({
      ...regexesObject,
      [searchWordPart]: constructRegexQuery({
        isUsingMainKey,
        keywords: [{ text: searchWordPart }],
      }),
    }),
    {}
  );
  let keywords =
    version === Version.VERSION_2 && searchWord
      ? expandVerb(searchWord, allVerbsAndSuffixes).map(({ text, wordClass }) => {
          const pickedRegex = pick(
            constructRegexQuery({
              isUsingMainKey,
              keywords: [{ text }],
            }),
            ['wordReg']
          );
          const keyWord: Keyword = {
            text,
            wordClass,
            regex: pickedRegex,
          };
          return keyWord;
        })
      : [];
  // Attempt to breakdown as noun if there is no breakdown as verb
  if (!keywords.length && searchWord) {
    keywords =
      version === Version.VERSION_2
        ? expandNoun(searchWord, allVerbsAndSuffixes).map(({ text, wordClass }) => ({
            text,
            wordClass: wordClass.concat([
              WordClass.NNC.value,
              WordClass.PRN.value,
              WordClass.NNP.value,
            ]),
            regex: pick(
              constructRegexQuery({
                isUsingMainKey,
                keywords: [{ text }],
              }),
              ['wordReg']
            ),
          }))
        : [];
  }
  if (!keywords.length && searchWord) {
    keywords = (
      version === Version.VERSION_2
        ? searchWordParts.map((searchWordPart) => {
            const expandedVerb = expandVerb(searchWordPart, allVerbsAndSuffixes);
            const result = expandedVerb.length
              ? expandedVerb.map(({ text, wordClass }) => ({
                  text,
                  wordClass,
                  regex: pick(
                    constructRegexQuery({
                      isUsingMainKey,
                      keywords: [{ text }],
                    }),
                    ['wordReg']
                  ),
                }))
              : // @ts-expect-error no index signature with parameter type string
                [{ text: searchWordPart, wordClass: [], regex: regexes[searchWordPart] }];

            return result;
          })
        : []
    ).flat();
  }
  const page = parseInt(pageQuery, 10);
  const range = parseRange(rangeQuery);
  const { skip, limit } = convertToSkipAndLimit({ page, range });
  const strict = strictQuery === 'true';
  const dialects = dialectsQuery === 'true';
  const examples = examplesQuery === 'true';
  // @ts-expect-error toUpperCase
  const style = stylesQuery && ExampleStyles[stylesQuery.toUpperCase()].value;
  const tags = tagsQuery
    ? tagsQuery
        .replace(/[[\]']/g, '')
        .split(',')
        .map((tag) => tag.trim())
    : [];
  const wordClasses = wordClassesQuery
    ? wordClassesQuery
        .replace(/[[\]']/g, '')
        .split(',')
        .map((wordClass) => wordClass.trim())
    : [];
  const resolve = resolveQuery === 'true';
  const flags: Flags = {
    dialects,
    examples,
    style,
    resolve,
  };

  const filters: Filters = {
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
