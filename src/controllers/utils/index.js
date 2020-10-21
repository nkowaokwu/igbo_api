import stringSimilarity from 'string-similarity';
import { assign, orderBy } from 'lodash';
import removePrefix from '../../shared/utils/removePrefix';
import createRegExp from '../../shared/utils/createRegExp';

const RESPONSE_LIMIT = 10;

/* Either creates a regex pattern for provided searchWord
or fallbacks to matching every word */
export const createQueryRegex = (searchWord) => (!searchWord ? /./ : createRegExp(searchWord));

/* Sorts all the docs based on the provided searchWord */
export const sortDocsByDefinitions = (searchWord, docs) => {
  docs.sort((prevWord, nextWord) => {
    const prevDocDifference = stringSimilarity.compareTwoStrings(searchWord, prevWord.definitions[0] || '') * -100;
    const nextDocDifference = stringSimilarity.compareTwoStrings(searchWord, nextWord.definitions[0] || '') * -100;
    return prevDocDifference - nextDocDifference;
  });
  return docs;
};

/* Wrapper function to prep response by limiting number of docs return to the client */
export const paginate = (res, docs, page) => {
  res.setHeader('Content-Range', docs.length);
  return docs.slice(page * RESPONSE_LIMIT, RESPONSE_LIMIT * (page + 1));
};

/* Preps response with sorting and paginating */
export const prepResponse = (res, docs, page, sort) => {
  const tenDocs = paginate(res, docs, page);
  return res.send(orderBy(tenDocs, [sort.key], [sort.direction]));
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

/* Converts the range query into a number to be used as the page query */
const convertRangeToPage = (range = '[0,10]') => {
  try {
    const parsedRange = typeof range === 'object' ? range : JSON.parse(range) || [0, 10];
    return parseInt(parsedRange[0], 10) || 0;
  } catch {
    return 0;
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
    return {
      key: 'id',
      direction: 'asc',
    };
  }
};

/* Handles all the queries for searching in the database */
export const handleQueries = (query = {}) => {
  const {
    keyword = '',
    page: pageQuery = '',
    range,
    sort: sortQuery,
    filter: filterQuery,
  } = query;
  const filter = convertFilterToKeyword(filterQuery);
  const searchWord = removePrefix(keyword || filter || '');
  const regexKeyword = createQueryRegex(searchWord);
  const page = parseInt(pageQuery, 10) || convertRangeToPage(range) || 0;
  const sort = parseSortKeys(sortQuery);
  return {
    searchWord,
    regexKeyword,
    page,
    sort,
  };
};

/* Updates a document's merge property with a document id */
export const updateDocumentMerge = (doc, id) => {
  const updatedDoc = assign(doc, { merged: id });
  updatedDoc.save();
};
