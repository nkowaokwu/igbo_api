import { Response } from 'express';
import ExampleStyles from '../../shared/constants/ExampleStyles';
import Version from '../../shared/constants/Version';
import createRegExp from '../../shared/utils/createRegExp';
import removePrefix from '../../shared/utils/removePrefix';
import { IgboAPIRequest, OutgoingExample, OutgoingWord } from '../../types';
import { OutgoingLegacyWord } from '../../types/word';
import { Filters } from '../types';
import convertToSkipAndLimit from './convertToSkipAndLimit';
import parseRange from './parseRange';
import { Flags, Keyword } from './types';

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
    | Partial<OutgoingWord>
    | Partial<OutgoingLegacyWord>
    | Partial<OutgoingExample>
    | Partial<OutgoingWord>[]
    | Partial<OutgoingLegacyWord>[]
    | Partial<OutgoingExample>[],
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
  const hasQuotes = keywordQuery && keywordQuery.match(/["'].*["']/) !== null;
  const keyword = keywordQuery.replace(/["']/g, '');
  const version = baseUrl.endsWith(Version.VERSION_2) ? Version.VERSION_2 : Version.VERSION_1;
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '').replace(/[Aa]na m /, 'm ');
  const regex = constructRegexQuery({ isUsingMainKey, keywords: [{ text: searchWord }] });
  const keywords: Keyword[] = [];
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
