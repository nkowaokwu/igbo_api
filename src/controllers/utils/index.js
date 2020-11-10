import stringSimilarity from 'string-similarity';
import {
  assign,
  orderBy,
} from 'lodash';
import removePrefix from '../../shared/utils/removePrefix';
import createRegExp from '../../shared/utils/createRegExp';

const DEFAULT_RESPONSE_LIMIT = 10;
const MAX_RESPONSE_LIMIT = 25;

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the docs based on the provided searchWord */
export const sortDocsBy = (searchWord, docs, key) => {
  docs.sort((prevWord, nextWord) => {
    const prevWordValue = Array.isArray(prevWord[key]) ? prevWord[key][0] : prevWord[key];
    const nextWordValue = Array.isArray(nextWord[key]) ? nextWord[key][0] : nextWord[key];
    const prevDocDifference = stringSimilarity.compareTwoStrings(searchWord, prevWordValue || '') * -100;
    const nextDocDifference = stringSimilarity.compareTwoStrings(searchWord, nextWordValue || '') * -100;
    return prevDocDifference - nextDocDifference;
  });
  return docs;
};

/* Validates the provided range */
const isValidRange = (range) => {
  const validRange = range;
  validRange[1] += 1;
  return !(validRange[1] - validRange[0] > MAX_RESPONSE_LIMIT) && !(validRange[1] - validRange[0] < 0);
};

/* Wrapper function to prep response by limiting number of docs return to the client */
export const paginate = (res, docs, page, range) => {
  res.setHeader('Content-Range', docs.length);
  if (Array.isArray(range) && isValidRange(range)) {
    return docs.slice(...range);
  }
  return docs.slice(page * DEFAULT_RESPONSE_LIMIT, DEFAULT_RESPONSE_LIMIT * (page + 1));
};

/* Preps response with sorting and paginating */
export const prepResponse = ({
  res,
  docs,
  page,
  sort,
  range,
}) => {
  const tenDocs = paginate(res, docs, page, range);
  const sendDocs = sort ? orderBy(tenDocs, [sort.key], [sort.direction]) : tenDocs;
  return res.send(sendDocs);
};

/* Converts the filter query into a word to be used as the keyword query */
const convertFilterToKeyword = (filter = '{"word": ""}') => {
  try {
    const parsedFilter = typeof filter === 'object' ? filter : JSON.parse(filter) || { word: '' };
    const firstFilterKey = Object.keys(parsedFilter)[0];
    return parsedFilter[firstFilterKey];
  } catch {
    return '';
  }
};

/* Parses the ranges query to turn into an array */
const parseRange = (range) => {
  try {
    const parsedRange = typeof range === 'object' ? range : JSON.parse(range) || null;
    return parsedRange;
  } catch {
    return null;
  }
};

/* Parses out the key and the direction of sorting out into an object */
const parseSortKeys = (sort = '["", ""]') => {
  try {
    const parsedSort = JSON.parse(sort) || ['id', 'ASC'];
    const key = parsedSort[0];
    const direction = parsedSort[1].toLowerCase() || '';
    return {
      key,
      direction,
    };
  } catch {
    return null;
  }
};

/* Handles all the queries for searching in the database */
export const handleQueries = (query = {}) => {
  const {
    keyword = '',
    page: pageQuery = '',
    range: rangeQuery = '',
    sort: sortQuery,
    filter: filterQuery,
  } = query;
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '');
  const regexKeyword = createQueryRegex(searchWord);
  const page = parseInt(pageQuery, 10) || 0;
  const range = parseRange(rangeQuery) || 0;
  const sort = parseSortKeys(sortQuery);
  return {
    searchWord,
    regexKeyword,
    page,
    sort,
    range,
  };
};

/* Updates a document's merge property with a document id */
export const updateDocumentMerge = (suggestionDoc, originalDocId) => {
  const updatedSuggestion = assign(suggestionDoc, { merged: originalDocId });
  return updatedSuggestion.save();
};
